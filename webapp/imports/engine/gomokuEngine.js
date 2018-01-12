import Immutable from "immutable"

// Constants and helpers

export const BOARD_SIZE = 19
export const GLOBAL_DEPTH = 3

// define in which ways threats can be found
// NOTE: step functions modify the passed object
const threatFinders = [
  (location, delta) => { location.row += delta }, // down
  (location, delta) => { location.col += delta }, // right
  (location, delta) => {
    location.row += delta; location.col += delta // right-down
  },
  (location, delta) => {
    location.row -= delta; location.col += delta // right-up
  },
]

// should be referenced as such:
// scoreMagnitude[played.length][expansions.length]
// TODO: maybe take into account skipped
const scoreMagnitude = {
  2: { 0: 0, 1: 5, 2: 8 },
  3: { 0: 0, 1: 20, 2: 30 },
  4: { 0: 0, 1: 50, 2: 10000 },
  5: {
    0: 100000000,
    1: 100000000,
    2: 100000000,
  },
}

export class Threat {
  constructor(finderIndex, player = null, played = [], span = 0) {
    this.finderIndex = finderIndex
    this.player = player

    // locations where the player has already played
    this.played = played

    // the size of the threat based on just what's been played
    this.span = span

    // number of expansions on either end
    this.expansions = 0

    this.score = 0
  }

  // update expansions, cell threats, and score; return whether the threat
  // can expand or not
  updateDependents(board, threatIndex) {
    // update the expansions
    this.expansions = 0
    if (this.span < 5) {
      let possibleExpansions = [
        { delta: -1, playedIndex: 0 },
        { delta: 1, playedIndex: this.played.length - 1 },
      ]

      _.each(possibleExpansions, ({ delta, playedIndex }) => {
        let loc = _.clone(this.played[playedIndex])
        threatFinders[this.finderIndex](loc, delta)

        // what happens when the board is the current player there? =>
        // it'd be included in the threat or else the threat is long enough
        // to not have expansions
        if (!Board.outsideBoard(loc) &&
            board.values.getIn([loc.row, loc.col]) === null) {
          this.expansions++
        }
      })
    }

    // if the threat can't grow it shouldn't be added
    if (this.span - this.played.length + this.expansions <= 0) {
      return false
    }

    // update the cell threats
    let current = _.clone(this.played[0])
    _.times(this.span, () => {
      let path = [this.finderIndex, current.row, current.col, threatIndex]
      board.cellThreats = board.cellThreats.setIn(path, this.player)

      threatFinders[this.finderIndex](current, 1)
    })

    // update the score
    let magnitude = scoreMagnitude[this.played.length][this.expansions]
    this.score = magnitude * (this.player ? 1 : -1)

    return true
  }

  static getSpan(played) {
    return 1 + Math.abs(Board.compareLocs(played[0], played[played.length - 1]))
  }

  finalize(board, threatIndex) {
    this.played.sort(Board.compareLocs)
    this.span = Threat.getSpan(this.played)

    return this.updateDependents(board, threatIndex)
  }

  // returns a new joined threat
  joinIfPossible(otherThreat, board, threatIndex) {
    // concatenate, sort, and remove duplicates
    let allPlayed = this.played.concat(otherThreat.played)
    allPlayed.sort(Board.compareLocs)
    let played = []
    let last = undefined;
    _.each(allPlayed, (loc) => {
      if (last === undefined || Board.compareLocs(loc, last) !== 0) {
        played.push(loc)
      }

      last = loc
    })
    let span = Threat.getSpan(played)

    if (span <= 5) {
      let joined = new Threat(this.finderIndex, this.player, played, span)

      console.assert(joined.updateDependents(board, threatIndex),
          "We've got a threat that can't grow")

      return joined
    }
  }

  toJS() {
    return {
      finderIndex: this.finderIndex,
      player: this.player,
      played: this.played,
      expansions: this.expansions,
      span: this.span,
      score: this.score,
    }
  }
}

export class Board {
  // Instance variables
  // - playerNameMap  mapping from player to name of player
  // - player         which player - true if it's the optimizing player
  // - values         the board values: Immutable [row, col] => true, false, null
  // - inPlayCells    which cells are in play: Immutable [row, col] => true
  // - threats        Immutable array of threats
  // - cellThreats    list of threats in each cell:
  //                    Immutable [threatFinder, row, col, threatIndex] => player
  // - winningThreat  winning threat if it exists
  constructor(playerNameMap, player, values, inPlayCells, threats, cellThreats,
      winningThreat) {
    this.playerNameMap = playerNameMap

    if (typeof(player) === "boolean") {
      this.player = player
      this.values = values
      this.inPlayCells = inPlayCells
      this.threats = threats
      this.cellThreats = cellThreats
      this.winningThreat = winningThreat
    } else {
      // create a new board from scratch
      this.player = true
      this.values = Immutable.fromJS(Array(BOARD_SIZE)
        .fill(Array(BOARD_SIZE)
          .fill(null)))
      this.inPlayCells = new Immutable.Map()
      this.threats = Immutable.fromJS([])
      this.cellThreats = Immutable.fromJS(Array(threatFinders.length)
        .fill(Array(BOARD_SIZE)
          .fill(Array(BOARD_SIZE)
            .fill({}))))
      this.winningThreat = null
    }
  }

  // TODO
  static updateThreatsAround(player, { row, col }, values, threats,
      cellThreats, winningThreat) {
    for (finderIndex in threatFinders) {

      let deltas = [ -1, 1 ]
      let addThreats = []
      let joinedThreats = {}

      _.each([ false, true ], (firstBit) => {
        let potentialSpan = 1

        // go the other way the second time around
        otherWay:
        for (secondBit of [ false, true ]) {
          let current = { row, col }
          let skipped = []
          // if we're going backwards and we we've found something...
          if (values[row][col] === null && secondBit === true
              && threat.played.length > 0) {
            skipped = [{ row, col }]
          }

          // What does that carret do? http://stackoverflow.com/a/3618366
          let delta = deltas[firstBit ^ secondBit]

          nextCell:
          for (i = 0; (i < 5) && (threat.span + skipped.length < 5); i++) {
            threatFinders[finderIndex](current, delta)

            // check to see if we're still on the board
            if (Board.outsideBoard(current)) break

            let value = values[current.row][current.col]
            if (value === player) {
              // if the cell we're looking at is part of a threat with
              // this finder, check to see if this should join that threat.
              let currentThreats = cellThreats.getIn([
                finderIndex, current.row, current.col
              ])

              for (let threatIndex of currentThreats.keys()) {
                // don't join it if it's already been joined
                // NOTE: joinedThreats has larger scope
                if (joinedThreats[threatIndex]) continue nextCell

                // check to see if we should join that threat
                let potentialLocations = threat.played
                    .concat(threat.skipped).concat(skipped)
                let overlap = _.reduce(potentialLocations, (total, loc) => {
                  let path = [finderIndex, loc.row, loc.col, threatIndex]
                  if (cellThreats.getIn(path) !== undefined) {
                    total += 1
                  }

                  return total;
                }, 0)

                let existing = threats[threatIndex]
                let toExtend = threat.span + skipped.length - overlap
                if (existing.span + toExtend <= 5) {
                  joinedThreats[threatIndex] = true

                  // TODO: why are we merging threats that are empty?
                  cellThreats = Board.mergeThreats(existing, threat,
                      values, cellThreats, threatIndex, skipped)
                  threats[threatIndex] = threat

                  if (threat.played.length === 5) {
                    winningThreat = threat
                  }

                  // we should be continuing down the other way to see if we
                  // can add to the current threat
                  // TODO:
                  // continue otherWay
                  return
                }
              }

              threat.played.push(_.clone(current))
              threat.skipped = threat.skipped.concat(skipped)
              threat.span += 1 + skipped.length
              skipped = []
              potentialSpan++

            } else if (value === null) {
              // it's an empty spot
              skipped.push(_.clone(current))
              potentialSpan++
            } else {
              // It's the other player's piece -- time to quit this direction
              // and check if this will disrupt any of their threats.
              // If it's the first piece we're looking at in this direction
              // then it's possible we should remove it if the other player's
              // threat is exactly two long.
              let threatsPath = [finderIndex, current.row, current.col]
              let threatsHere = cellThreats.getIn(threatsPath)

              threatsHere.keySeq().forEach(threatIndex => {
                let currentThreat = threats[threatIndex]

                // Check to see if we should remove the other player's pieces.
                // Only do this if the player just moved there to avoid
                // recursion.
                if (currentThreat.span === 2 && values[row][col] === player) {
                  var afterThreat = _.clone(current)
                  threatFinders[finderIndex](afterThreat, delta)
                  threatFinders[finderIndex](afterThreat, delta)

                  if (!Board.outsideBoard(afterThreat) &&
                      values[afterThreat.row][afterThreat.col] === player) {
                    // They've captured a threat! Time to take it off the board

                    _.each(currentThreat.played, (location) => {
                      // don't corrupt the board in other branches by creating
                      // a copy of the row before modifying it
                      values[location.row] = values[location.row].slice();
                      values[location.row][location.col] = null
                    })
                    cellThreats = Board.removeFromCellThreats(threatIndex,
                        currentThreat, cellThreats)
                    delete threats[threatIndex]

                    // connect any threats that might span the newly
                    // removed pieces
                    _.each(currentThreat.played, (location) => {
                      // TODO: fix winningThreat

                      ({ cellThreats, winningThreat } =
                          Board.updateThreatsAround(player, location, values,
                              threats, cellThreats))
                    })

                    // go on to the next threat
                    return
                  }
                }

                updated = Board.updateCanExpand(currentThreat, values)

                if (updated) {
                  threats[threatIndex] = updated
                } else {
                  cellThreats = Board.removeFromCellThreats(threatIndex,
                      currentThreat, cellThreats)
                  delete threats[threatIndex]
                }
              });

              break
            }
          }
        }

        if (threat.played.length <= 1 || potentialSpan < 5) return

        // make sure it's "new" - has a cell with no threats that've been
        // joined
        let noThreatsCell = false
        let locations = threat.played.concat(threat.skipped)

        for (index in locations) {
          let location = locations[index]
          let path = [finderIndex, location.row, location.col]
          let threatIndexes = Object.keys(cellThreats.getIn(path).toJS())
          let filteredIndexes = _.filter(threatIndexes, index => {
            return !joinedThreats[index]
          })

          if (filteredIndexes.length === 0) {
            noThreatsCell = true
            break
          }
        }
        if (!noThreatsCell) return

        // sort the played array of the threats (useful later on)
        threat.played.sort(Board.compareLocs)
        threat.skipped.sort(Board.compareLocs)

        addThreats.push(threat)
      })

      // if the two threats are the same remove the second one
      if (addThreats.length > 1 &&
          _.isEqual(addThreats[0].played, addThreats[1].played)) {
        addThreats = addThreats.slice(0, 1)
      }

      _.each(addThreats, (threat) => {
        cellThreats = Board.addThreat(threats, cellThreats, threat, values)
      })
    }

    return { cellThreats, winningThreat }
  }

  addMergeThreats({ row, col }) {
    // figure out if we need to add/join any threats for the current player
    for (finderIndex in threatFinders) {
      let deltas = [ -1, 1 ]

      // go backwards and then forwards, adding to the threat in each direction,
      // and then do the reverse of all that
      nextThreat: for (firstBit of [ false, true ]) {
        let newThreat = new Threat(finderIndex)

        // if the cell has been played, start with that
        let value = this.values.getIn([row, col])
        if (value !== null) {
          newThreat.player = value
          newThreat.played.push({ row, col })
          newThreat.span++
        }

        let potentialSpan = newThreat.span

        otherDirection: for (secondBit of [ false, true ]) {
          let current = { row, col }

          // if cell is blank, going backwards, and we we've found something...
          if (this.values.getIn([row, col]) === null && secondBit === true
              && newThreat.played.length > 0) {
            potentialSpan++
          }

          nextCell: for (i = 0; (i < 5) && (potentialSpan < 5); i++) {
            // ^ is XOR: http://stackoverflow.com/a/3618366
            threatFinders[finderIndex](current, deltas[firstBit ^ secondBit])
            if (Board.outsideBoard(current)) break

            value = this.values.getIn([current.row, current.col])

            if (newThreat.player === null) {
              // if nothing is interesting than just continue on
              if (value === null) {
                continue nextCell
              }

              // claim the threat for this player if the cell's not blank
              newThreat.player = value
            }

            // on finding an opponent cell stop looking in this direction
            if (value === !newThreat.player) {
              continue otherDirection
            }

            potentialSpan++

            if (newThreat.player !== null && value === newThreat.player) {
              newThreat.played.push(_.clone(current))

              // if the cell we're looking at is part of threats with
              // this finder, check to see if we should join any of those
              let currentThreats = this.cellThreats.getIn([
                finderIndex, current.row, current.col
              ])

              let joinedThreat = undefined
              for (let threatIndex of currentThreats.keys()) {
                if (joinedThreat =
                    newThreat.joinIfPossible(this.threats.get(threatIndex),
                        this, threatIndex)) {
                  this.threats = this.threats.set(threatIndex, joinedThreat)

                  if (joinedThreat.played.length === 5) {
                    this.winningThreat = joinedThreat
                  }
                }
              }

              // if it joined any of the treats then move on
              if (joinedThreat) {
                continue nextThreat
              }
            }
          }
        }

        // check if we've found a novel threat
        if (newThreat.played.length < 2) continue nextThreat

        // by this point if a threat were within another threat it would have
        // joined that threat instead of getting here

        // TODO: make sure when creating a threat there's enough space to grow
        this.addThreat(newThreat)
      }
    }
  }

  checkCaptures({ row, col }) {
    // TODO
  }

  addThreat(threat) {
    if (threat.finalize(this, this.threats.size)) {
      this.threats = this.threats.push(threat)
    }
  }

  removeThreat(threatIndex) {
    let threat = this.threats.get(threatIndex)
    let current = _.clone(threat.played[0])

    _.times(threat.span, () => {
      let path = [threat.finderIndex, current.row, current.col, threatIndex]
      this.cellThreats = this.cellThreats.deleteIn(path)

      threatFinders[threat.finderIndex](current, 1)
    })

    this.threats = this.threats.set(threatIndex, undefined)
  }

  splitBlockOpponent({ row, col }) {
    for (finderIndex in threatFinders) {
      // split opponent's threats
      let threatsHere = this.cellThreats.getIn([finderIndex, row, col])
      for ([threatIndex, threatPlayer] of threatsHere.entrySeq()) {
        // if the move splits the opponent delete it and then try to
        // cannibalize it into smaller threats
        if (threatPlayer === this.player) {
          let threat = this.threats.get(threatIndex)
          this.removeThreat(threatIndex)

          // split played into before and after the interfering move
          let sidedMoves = { [ Number(-1) ]: [], 1: [] }
          _.each(threat.played, (play) => {
            let sign = Math.sign(Board.compareLocs(play, { row, col }))
            sidedMoves[sign].push(play)
          })

          _.each(sidedMoves, (moves, sidedness) => {
            if (moves.length > 1) {
              // should make a threat out of the cannibalized side if:
              // - none of them are part of a threat
              // - not all three share the same threat(s)
              // ... basically if the intersection empty
              // NOTE: movesCellThreats is a 2D array and should be -- see
              //   use of apply below (btw apply is native Javascript)
              let movesCellThreats = _.map(moves, ({ row, col }) => {
                let path = [finderIndex, row, col]
                return this.cellThreats.getIn(path).keySeq().toArray()
              })

              if (_.intersection.apply(null, movesCellThreats).length === 0) {
                let newThreat = new Threat(finderIndex, threatPlayer)
                newThreat.played = moves
                this.addThreat(newThreat)
              }
            }
          })
        }
      }

      // remove blocked threats next to the move (look at expansions count)
      otherDirection: for (let delta of [-1, 1]) {
        let loc = { row, col }
        for (let extraSpace = 0; extraSpace < 2; extraSpace++) {
          threatFinders[finderIndex](loc, delta)
          if (Board.outsideBoard(loc)) continue otherDirection

          let value = this.values.getIn([loc.row, loc.col])
          if (value === null) continue
          if (value === !this.player) continue otherDirection

          let threatsThere =
              this.cellThreats.getIn([finderIndex, loc.row, loc.col])
          for ([threatIndex, threatPlayer] of threatsThere.entrySeq()) {
            if (threatPlayer === this.player) {
              let threat = this.threats.get(threatIndex)

              // if there's not enough space for the threat grow, remove it
              if (extraSpace === 0) {
                // if it's right next to it re-finalize the treat
                newThreat = new Threat(threat.finderIndex, threat.player,
                    threat.played, threat.span)
                if (newThreat.finalize(this, threatIndex)) {
                  this.threats = this.threats.set(threatIndex, newThreat)
                } else {
                  this.removeThreat(threatIndex)
                }
              } else if (extraSpace > 0 && extraSpace + threat.span < 5 &&
                    threat.expansions === 1) {
                this.removeThreat(threatIndex)
              }
            }
          }

          continue otherDirection
        }
      }
    }
  }

  updateInPlayAround({ row, col }) {
    this.inPlayCells = this.inPlayCells.deleteIn([row, col])

    // add the cells around it
    for (let r = row - 1; r <= row + 1; r++) {
      if (r < 0 || r >= BOARD_SIZE) continue

      for (let c = col - 1; c <= col + 1; c++) {
        if (c < 0 || c >= BOARD_SIZE || this.values.getIn([r, c]) !== null) {
          continue
        }

        this.inPlayCells = this.inPlayCells.setIn([r, c], true)
      }
    }
  }

  move({ row, col }) {
    console.assert(this.values.getIn([row, col]) === null, "Invalid move")
    console.assert(!Board.outsideBoard({ row, col }), "Outside board")

    let newBoard = new Board(this.playerNameMap, !this.player, this.values,
        this.inPlayCells, this.threats, this.cellThreats, this.winningThreat)

    // put the piece down
    newBoard.values = newBoard.values.setIn([row, col], this.player)

    // check if we need to split any opponent threats
    newBoard.splitBlockOpponent({ row, col })

    // remove any captured pieces and update threats around those empty cells
    newBoard.checkCaptures({ row, col })

    // search for new threats for the player that just played
    newBoard.addMergeThreats({ row, col })

    // update inPlayCells (remove move, add everything around it)
    newBoard.updateInPlayAround({ row, col })

    return newBoard
  }

  // sort the possible moves based on how many threats they can help
  // for the current player and how many they can disrupt for the other
  // player
  getMoves() {
    let cellPotentials = this.inPlayCells.toJS()
    _.each(cellPotentials, (rowColumns, row) => {
      _.each(rowColumns, (value, col) => {
        cellPotentials[row][col] = 0
      })
    })

    _.each(this.threats, (threat, threatIndex) => {
      _.each(threat.skipped.concat(threat.expansions), ({ row, col }) => {
        if (!cellPotentials[row]) {
          cellPotentials[row] = {}
        }

        cellPotentials[row][col] += Math.abs(threat.score)
      })
    })

    let moves = []
    _.each(cellPotentials, (colValues, row) => {
      _.each(colValues, (score, col) => {
        moves.push({
          score,
          row: parseInt(row),
          col: parseInt(col)
        })
      })
    })

    return moves.sort((first, second) => {
      return second.score - first.score
    })
  }

  // TODO: check to make sure I understand wtf this is doing
  alphabeta(depth, alpha, beta) {
    if (depth === 0 || this.hasWinner()) {
      return {
        // this is the heuristic
        value: _.reduce(this.threats, (memo, threat) => {
          return memo + threat.score
        }, 0)
      }
    }

    let valueAndMove = {
      value: this.player ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    }

    for (let move of this.getMoves()) {
      let child = {
        value: this.move(move).alphabeta(depth - 1, alpha, beta).value,
        move,
      }

      if (this.player) {
        valueAndMove = Board.compareABValues(Math.max, valueAndMove, child)
        alpha = Math.max(alpha, valueAndMove.value)
      } else {
        valueAndMove = Board.compareABValues(Math.min, valueAndMove, child)
        beta = Math.min(beta, valueAndMove.value)
      }

      if (beta <= alpha) {
        break
      }
    }

    return valueAndMove
  }

  getBestMove() {
    // hardcoded starting move
    if (this.inPlayCells.size === 0) {
      return { row: 8, col: 8 }
    }

    let best = this.alphabeta(GLOBAL_DEPTH, Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY)
    return _.omit(best.move, "score")
  }

  // Helpers

  // compare by column then row
  // NOTE: order important in addThreat when adding expansion information
  // because of the way deltas work with the current implementation of
  // threatFinders
  static compareLocs(first, second) {
    if (first.col != second.col) return first.col - second.col
    if (first.row != second.row) return first.row - second.row
    return 0
  }

  static outsideBoard({ row, col }) {
    return row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE;
  }

  // used in alphabeta()
  static compareABValues(compare, first, second) {
    if (compare(first.value, second.value) === first.value) {
      return first
    }

    return second
  }

  hasWinner() { return !!this.winningThreat }
  getWinningThreat() {
    return this.winningThreat || {}
  }

  getThreats() { return this.threats }
  getCellThreats() { return this.cellThreats }
  getInPlayCells() { return this.inPlayCells.toJS() }
  getValues() { return this.values }
  getPlayer() { return this.player }

  // Tooling

  // return the thing we get from the input (strings)
  getStringBoard() {
    return _.map(this.values, (row) => {
      return _.map(row, (value) => {
        return this.playerNameMap[value] || null
      })
    })
  }

  printCellThreats() {
    console.log("cell threats:");
    this.cellThreats.entrySeq().forEach(([finderKey, values]) => {
      console.log(` finderKey: ${finderKey}`)

      values.entrySeq().forEach(([rowIndex, rowValues]) => {
        let lineString = `  ${rowIndex < 10 ? " " : ""}${rowIndex}: [`

        rowValues.entrySeq().forEach(([colIndex, colValues]) => {
          let mapString = JSON.stringify(colValues.toJS())
              .replace(/["{}]/g, "")
              .replace(/true/g, "t")
              .replace(/false/g, "f")

          if (mapString === "") {
            mapString = "|";
          } else {
            mapString = `${colIndex}: ` + mapString
          }

          lineString += `${mapString.padEnd(8)}`
        })

        console.log(lineString + " ]")
      });
    });
  }

  boardValuesToString(singleCharMap) {
    return "    " + [...Array(19).keys()]
        .map(number => String(number).slice(-1))
        .join(" ") + "\n" +
      _.reduce(this.values.toJS(), (memo, rowValues, rowIndex) => {
        return memo + `${String(rowIndex).padStart(2)}: ` +
            _.map(rowValues, (value) => {
              return singleCharMap[value] || "."
            }).join(" ") + "\n"
      }, "")
  }

  toString() {
    let singleCharMap = {
      true: this.playerNameMap[true].substring(0, 1),
      false: this.playerNameMap[false].substring(0, 1),
    }

    // might have next move off
    return `next move will be by ${this.playerNameMap[this.player]}\n` +
        `${singleCharMap[true]} = ${this.playerNameMap[true]}\n` +
        `${singleCharMap[false]} = ${this.playerNameMap[false]}\n` +
        this.boardValuesToString(singleCharMap)
  }
}



export function createBoardState(nextPlayer, otherPlayer, stringBoard) {
  let board = new Board({
    true: nextPlayer,
    false: otherPlayer,
  })

  // recreate board move by move
  for (let row in stringBoard) {
    for (let col in stringBoard[row]) {
      let value = stringBoard[row][col]

      if (value) {
        board.player = nextPlayer === value

        board = board.move({
          row: parseInt(row),
          col: parseInt(col),
        })
      }
    }
  }

  // set the next player
  board.player = true

  return board
}
