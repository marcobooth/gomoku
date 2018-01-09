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
  constructor(player, finderIndex) {
    this.player = player
    this.finderIndex = finderIndex

    // locations where the player has already played
    this.played = []

    // locations that need to be "filled in" to complete the 5-in-a-row
    this.skipped = []

    // expansion locations on either end
    this.expansions = []

    // the size of the threat based on just what's been played
    this.span = 0
  }

  // TODO
  // calculate score, expansions for the threat
  static expansionsAndScore(threat, values) {
    threat.expansions = []
    if (threat.span < 5) {
      let possibleExtensions = [
        { delta: -1, playedIndex: 0 },
        { delta: 1, playedIndex: threat.played.length - 1 },
      ]

      _.each(possibleExtensions, ({ delta, playedIndex }) => {
        let location = _.clone(threat.played[playedIndex])
        threatFinders[threat.finderIndex](location, delta)

        // what happens when the board is the current player there? =>
        // it'd be included in the threat or else the threat is long enough
        // to not have expansions
        if (!Board.outsideBoard(location) &&
            values[location.row][location.col] === null) {
          threat.expansions.push(location)
        }
      })
    }

    let { played, expansions } = threat
    let magnitude = scoreMagnitude[played.length][expansions.length]
    threat.score = magnitude * (threat.player ? 1 : -1)
  }

  // TODO
  // TODO: rename mergeWith
  static mergeThreats(oldThreat, newThreat, values, cellThreats, threatIndex,
        justSkipped) {
    // add to cellThreats
    let toAdd = newThreat.played.concat(newThreat.skipped).concat(justSkipped)
    _.each(toAdd, loc => {
      let path = [newThreat.finderIndex, loc.row, loc.col, threatIndex]
      cellThreats = cellThreats.setIn(path, newThreat.player)
    })

    // remove old skipped values that have just been played
    let oldSkipped = oldThreat.skipped
    _.each(newThreat.played, (location) => {
      oldSkipped = oldThreat.skipped.filter((skipped) => {
        return skipped.row !== location.row || skipped.col !== location.col
      })
    })
    newThreat.skipped = newThreat.skipped.concat(oldSkipped)

    // add non-duplicate values from justSkipped
    _.each(justSkipped, (location) => {
      for (threatLoc of newThreat.skipped) {
        if (threatLoc.row === location.row && threatLoc.col === location.col) {
          return
        }
      }

      newThreat.skipped.push(location)
    })
    newThreat.skipped.sort(Board.compareLocations)

    // add new played, remove duplicates (bandaid #1)
    let newPlayed = newThreat.played.concat(oldThreat.played)
    newPlayed.sort(Board.compareLocations)
    newPlayed = _.filter(newPlayed, (location, index) => {
      if (index === 0) return true

      return Board.compareLocations(newPlayed[index - 1], location) !== 0
    })
    newThreat.played = newPlayed

    // recalculate span
    let first = newThreat.played[0]
    let last = newThreat.played[newThreat.played.length - 1]
    let rowDiff = Math.abs(first.row - last.row)
    let colDiff = Math.abs(first.col - last.col)
    newThreat.span = Math.max(rowDiff, colDiff) + 1

    Board.expansionsAndScore(newThreat, values)

    return cellThreats
  }

  // TODO
  static updateCanExpand(threat, values) {
    // try going both directions and count the number of non-opposition pieces
    // NOTE: assume threat hasn't been bisected
    let potentialSpan = threat.span
    let startsAndDeltas = [
      { start: threat.played[0], delta: -1 },
      { start: threat.played[threat.played.length - 1], delta: 1 }
    ]

    for ({ start, delta } of startsAndDeltas) {
      let current = _.clone(start)

      for (let i = 0; i < 5 - threat.span; i++) {
        threatFinders[threat.finderIndex](current, delta)

        if (Board.outsideBoard(current) ||
            values[current.row][current.col] === !threat.player) {
          break
        }

        potentialSpan++
      }
    }

    if (potentialSpan >= 5) {
      // clone just in case it changes in expansionsAndScore
      let newThreat = _.clone(threat)
      Board.expansionsAndScore(newThreat, values)
      return newThreat
    }

    // the threat can no longer expand enough so return undefined
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

    if (typeof(variable) === "boolean") {
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
  // add expansions, add the threat to the threat list, link to it through
  // cellThreats (which is returned)
  static addThreat(newThreats, cellThreats, threat, values) {
    Board.expansionsAndScore(threat, values)

    newThreats.push(threat)

    // add to the cellThreats
    let threatIndex = newThreats.length - 1
    _.each(threat.played.concat(threat.skipped), ({ row, col }) => {
      let path = [threat.finderIndex, row, col, threatIndex]
      cellThreats = cellThreats.setIn(path, threat.player)
    })

    return cellThreats
  }

  // TODO: HERE
  searchThreatsAround({ row, col }) {
    
  }

  // TODO
  static updateThreatsAround(player, { row, col }, values, threats,
      cellThreats, winningThreat) {
    // figure out if we need to add/join any threats for the current player
    // and whether we should remove any two-length threats for the opposition
    // This is truly crazy stuff here. I'm so sorry to anyone reading it.
    for (finderIndex in threatFinders) {
      // go backwards and then forwards, adding to the threat in each direction,
      // and then do the reverse of all that
      let deltas = [ -1, 1 ]
      let addThreats = []
      let joinedThreats = {}

      _.each([ false, true ], (firstBit) => {
        let threat = Board.newThreat(player, finderIndex)
        if (values[row][col] !== null) {
          threat.played.push({ row, col })
          threat.span++
        }

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
        threat.played.sort(Board.compareLocations)
        threat.skipped.sort(Board.compareLocations)

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

  removeThreat(threatIndex) {
    let threat = this.threats.get(threatIndex)

    _.each(threat.played.concat(threat.skipped), (location) => {
      let path = [threat.finderIndex, location.row, location.col, threatIndex]
      this.cellThreats = this.cellThreats.deleteIn(path)
    })

    this.threats = this.threats.delete(threatIndex)
  }

  splitThreatsAround({ row, col }) {
    for (finderIndex in threatFinders) {
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
            let sign = Math.sign(Board.compareLocations(play, {row, col}))
            sidedMoves[sign].push(play)
          })
          console.log("sidedMoves:", sidedMoves);

          _.each(sidedMoves, (moves) => {
            if (moves.length > 1) {
              // should make a threat out of the cannibalized side if:
              // - none of them are part of a threat
              // - not all three share the same threat(s)
              // ... basically if the intersection empty
              let playedCellThreats = _.map(moves, ({ moveRow, moveCol }) => {
                let path = [finderIndex, moveRow, moveCol]
                return this.cellThreats.getIn(path).keySeq().toArray()
              })

              if (_.intersection.apply(null, playedCellThreats).length === 0) {
                console.assert(false, "I haven't done this yet")

                // TODO: extend with a counter -- need testing to see if we
                // can get the directionality from comparing to the move
              }
            }
          })
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
        if (c < 0 || c >= BOARD_SIZE || newValues[r][c] !== null) continue

        this.inPlayCells = this.inPlayCells.setIn([r, c], true)
      }
    }
  }

  move({ row, col }) {
    console.assert(this.values.getIn([row, col]) === null, "Invalid move")

    let newBoard = new Board(this.playerNameMap, !this.player, this.values,
        this.inPlayCells, this.threats, this.cellThreats, this.winningThreat)

    // put the piece down
    newBoard.values.setIn([row, col], this.player)

    // check if we need to split any opponent threats
    newBoard.splitThreatsAround({ row, col })

    // search for new threats for the player that just played
    newBoard.searchThreatsAround({ row, col })

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
  // NOTE: order important in addThreat when adding extension information
  // because of the way deltas work with the current implementation of
  // threatFinders
  static compareLocations(first, second) {
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

  static boardValuesToString(singleCharMap) {
    return "    " + [...Array(19).keys()]
        .map(number => String(number).slice(-1))
        .join(" ") + "\n" +
      _.reduce(this.values, (memo, rowValues, rowIndex) => {
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
        Board.boardValuesToString(singleCharMap)
  }
}



export function createEngineState(nextPlayer, otherPlayer, stringBoard) {
  let board = new Board(true, {
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
