import Immutable from "immutable"

// Constants and helpers

export const BOARD_SIZE = 19
export const GLOBAL_DEPTH = 3

// TODO: remove this
export var L = {}

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
  constructor(finderIndex, player = null, played = []) {
    this.finderIndex = finderIndex
    this.player = player

    // locations where the player has already played
    this.played = played

    // the size of the threat based on just what's been played
    this.span = 0

    // expansions on either side of the threat
    this.expansions = []

    // moves that are in the middle of the threat
    this.skipped = []

    this.score = 0
  }

  // update winningThreat, expansions, skipped, cellThreats, and score;
  // return whether the threat can expand or not
  updateDependents(board, threatIndex) {
    // has the player won?
    if (this.played.length === 5) {
      board.winningThreat = this
    }

    // update the expansions
    let expansions = []
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
          expansions.push({ row: loc.row, col: loc.col })
        }
      })
    }

    // update the skipped
    let loc = _.clone(this.played[0])
    let skipped = []
    for (i = 0; i < this.span - 2; i++) {
      threatFinders[this.finderIndex](loc, 1)

      if (board.values.getIn([loc.row, loc.col]) === null) {
        skipped.push({ row: loc.row, col: loc.col })
      }
    }
    if (skipped.length !== this.span - this.played.length) {
      console.log("Skipped length is incorrect!");
      console.log("board.toString():", board.toString());
      console.log("this:", this);
    }
    // console.assert(skipped.length === this.span - this.played.length,
    //     "Skipped length is incorrect")

    // if the threat can't grow it shouldn't be added
    if (skipped.length + expansions.length === 0 && this.played.length !== 5) {
      return false
    }

    this.expansions = expansions
    this.skipped = skipped

    // update the cell threats
    let current = _.clone(this.played[0])
    _.times(this.span, () => {
      let path = [this.finderIndex, current.row, current.col, threatIndex]
      board.cellThreats = board.cellThreats.setIn(path, this.player)

      threatFinders[this.finderIndex](current, 1)
    })

    // update the score
    let magnitude = scoreMagnitude[this.played.length][this.expansions.length]
    this.score = magnitude * (this.player ? 1 : -1)

    return true
  }

  // TODO: check nothing's changed permenantly before finalize is called
  // in case it fails to add/update
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
      let joined = new Threat(this.finderIndex, this.player, played)
      joined.span = span

      if (!joined.updateDependents(board, threatIndex)) {
        console.log("board.toString():", board.toString());
        console.log("joined:", joined);

        // console.assert(false,
        //     "We've got a threat that can't grow")
      }

      return joined
    }
  }

  static getSpan(played) {
    return 1 + Math.abs(Board.compareLocs(played[0], played[played.length - 1]))
  }

  toJS() {
    return {
      finderIndex: this.finderIndex,
      player: this.player,
      played: this.played,
      expansions: this.expansions,
      skipped: this.skipped,
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
      winningThreat, settingUp) {
    this.playerNameMap = playerNameMap

    if (typeof(player) === "boolean") {
      this.player = player
      this.values = values
      this.inPlayCells = inPlayCells
      this.threats = threats
      this.cellThreats = cellThreats
      this.winningThreat = winningThreat
      this.settingUp = settingUp
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
      this.settingUp = true
    }
  }

  addThreat(threat) {
    if (threat.finalize(this, this.threats.size)) {
      this.threats = this.threats.push(threat)
    }
  }

  removeThreat(threatIndex) {
    let threat = this.threats.get(threatIndex)
    let loc = _.clone(threat.played[0])

    _.times(threat.span, () => {
      let path = [threat.finderIndex, loc.row, loc.col, threatIndex]
      this.cellThreats = this.cellThreats.deleteIn(path)

      threatFinders[threat.finderIndex](loc, 1)
    })

    this.threats = this.threats.set(threatIndex, undefined)
  }

  addMergeAfterCapture({ row, col }) {
    // figure out if we need to add/join any threats for the current player
    for (finderIndex in threatFinders) {
      let deltas = [ -1, 1 ]

      // go backwards and then forwards, adding to the threat in each direction,
      // and then do the reverse of all that
      nextThreat: for (firstDir of [ false, true ]) {
        let newThreat = new Threat(finderIndex)

        // if the cell has been played, start with that
        let value = this.values.getIn([row, col])
        if (value !== null) {
          newThreat.player = value
          newThreat.played.push({ row, col })
          newThreat.span++
        }

        let potentialSpan = 1
        let playedSpan = newThreat.span

        otherDirection: for (secondDir of [ false, true ]) {
          let current = { row, col }

          // if cell is blank, going backwards, and we we've found something...
          if (this.values.getIn([row, col]) === null && secondDir === true
              && newThreat.played.length > 0) {
            playedSpan++
          }

          let skippedCount = 0
          nextCell: for (i = 0; (i < 4) &&
              (playedSpan + skippedCount < 5); i++) {
            // ^ is XOR: http://stackoverflow.com/a/3618366
            threatFinders[finderIndex](current, deltas[firstDir ^ secondDir])
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
              playedSpan += skippedCount + 1
              skippedCount = 0

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
                }
              }

              // if it joined any of the treats then move on
              if (joinedThreat) {
                if (!secondDir) {
                  // make a copy of the joined threat and continue in the
                  // other direction with that
                  newThreat = new Threat(joinedThreat.finderIndex,
                      joinedThreat.player, joinedThreat.played.slice(0))

                  continue otherDirection
                } else {
                  continue nextThreat
                }
              }
            } else {
              skippedCount++
            }
          }
        }

        // check if we've found a novel threat that has enough space to grow
        if (newThreat.played.length < 2 || potentialSpan < 5) {
          continue nextThreat
        }

        // by this point if a threat were within another threat it would have
        // joined that threat instead of getting here

        this.addThreat(newThreat)
      }
    }
  }

  captureThreat(threatIndex, threat) {
    for (let move of threat.played) {
      this.values =
          this.values.setIn([ move.row, move.col ], null)

      // recalculate threats that changed because of the capture
      let modifyIndexes = _.reduce(threatFinders, (memo, finder, index) => {
        let path = [index, move.row, move.col]
        return memo.concat(this.cellThreats.getIn(path).keySeq().toArray())
      }, [])

      for (let modifyIndex of modifyIndexes) {
        let modifying = this.threats.get(modifyIndex)

        let newPlayed = _.filter(modifying.played, (playMove) => {
          return Board.compareLocs(playMove, move) !== 0
        })
        let newThreat =
            new Threat(modifying.finderIndex, modifying.player, newPlayed)

        if (newPlayed.length >= 2 && newThreat.finalize(this, modifyIndex)) {
          this.threats = this.threats.set(modifyIndex, newThreat)
        } else {
          this.removeThreat(modifyIndex)
        }
      }

      L.a = L.l && move.row === 8 && move.col === 7
      this.addMergeAfterCapture(move, true)
      L.a = false
    }
  }

  addMergeThreats({ row, col }, afterCapture = false) {
    // figure out if we need to add/join any threats for the current player
    for (finderIndex in threatFinders) {
      let deltas = [ -1, 1 ]

      // go backwards and then forwards, adding to the threat in each direction,
      // and then do the reverse of all that
      nextThreat: for (firstDir of [ false, true ]) {
        let newThreat = new Threat(finderIndex)

        // if the cell has been played, start with that
        let value = this.values.getIn([row, col])
        if (value !== null) {
          newThreat.player = value
          newThreat.played.push({ row, col })
          newThreat.span++
        }

        let potentialSpan = 1
        let playedSpan = newThreat.span

        otherDirection: for (secondDir of [ false, true ]) {
          let current = { row, col }

          // if cell is blank, going backwards, and we we've found something...
          if (this.values.getIn([row, col]) === null && secondDir === true
              && newThreat.played.length > 0) {
            playedSpan++
          }

          let skippedCount = 0
          nextCell: for (i = 0; (i < 4) &&
              (playedSpan + skippedCount < 5); i++) {
            // ^ is XOR: http://stackoverflow.com/a/3618366
            threatFinders[finderIndex](current, deltas[firstDir ^ secondDir])
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
              playedSpan += skippedCount + 1
              skippedCount = 0

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
                }
              }

              // if it joined any of the treats then move on
              if (joinedThreat) {
                if (afterCapture && !secondDir) {
                  // make a copy of the joined threat and continue in the
                  // other direction with that
                  newThreat = new Threat(joinedThreat.finderIndex,
                      joinedThreat.player, joinedThreat.played.slice(0))

                  continue otherDirection
                } else {
                  continue nextThreat
                }
              }
            } else {
              skippedCount++
            }
          }
        }

        // check if we've found a novel threat that has enough space to grow
        if (newThreat.played.length < 2 || potentialSpan < 5) {
          continue nextThreat
        }

        // by this point if a threat were within another threat it would have
        // joined that threat instead of getting here

        this.addThreat(newThreat)
      }
    }
  }

  blockAndCapture({ row, col }) {
    for (finderIndex in threatFinders) {
      // remove blocked threats next to the move (look at expansions count)
      otherDirection: for (let delta of [-1, 1]) {
        let loc = { row, col }
        for (let extraSpace = 0; extraSpace < 2; extraSpace++) {
          threatFinders[finderIndex](loc, delta)
          if (Board.outsideBoard(loc)) continue otherDirection

          let value = this.values.getIn([loc.row, loc.col])
          if (value !== null) {
            if (value === this.player) {
              let threatsThere =
                  this.cellThreats.getIn([finderIndex, loc.row, loc.col])

              for ([threatIndex, threatPlayer] of threatsThere.entrySeq()) {
                // if there's not enough space for the threat grow, remove it
                // console.log("threatIndex:", threatIndex);
                let threat = this.threats.get(threatIndex)

                let space = extraSpace + threat.span
                if (space >= 5) continue

                // skip over the threat itself
                let far = _.clone(loc)
                _.times(threat.span, () => {
                  threatFinders[finderIndex](far, delta)
                })

                let removed = false
                while (space < 5) {
                  if (this.values.getIn([far.row, far.col]) === !this.player) {
                    removed = true
                    this.removeThreat(threatIndex)

                    if (!this.settingUp && extraSpace === 0 &&
                        threat.span === 2 && space === 2) {
                      this.captureThreat(threatIndex, threat)
                    }

                    break
                  } else {
                    threatFinders[finderIndex](far, delta)
                    space++
                  }
                }

                if (extraSpace === 0 && !removed) {
                  // if it's right next to it re-finalize to update expansions
                  // and possibly capture it (removing it from the board)
                  let newThreat = new Threat(threat.finderIndex, threat.player,
                      threat.played)
                  newThreat.finalize(this, threatIndex)
                  // console.assert(newThreat.finalize(this, threatIndex),
                  //     "Didn't look far enough")

                  this.threats = this.threats.set(threatIndex, newThreat)
                }
              }
            }

            continue otherDirection
          }
        }
      }
    }
  }

  splitOpponents({ row, col }) {
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
    // console.assert(this.values.getIn([row, col]) === null, "Invalid move")
    // console.assert(!Board.outsideBoard({ row, col }), "Outside board")

    let newBoard = new Board(this.playerNameMap, !this.player, this.values,
        this.inPlayCells, this.threats, this.cellThreats, this.winningThreat,
        this.settingUp)

    // put the piece down
    newBoard.values = newBoard.values.setIn([row, col], this.player)

    // check if we need to split any opponent threats
    newBoard.splitOpponents({ row, col })

    // block opponent threats
    newBoard.blockAndCapture({ row, col })

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

    for (let threat of this.threats.values()) {
      if (!threat) continue

      _.each(threat.skipped.concat(threat.expansions), ({ row, col }) => {
        if (!cellPotentials[row]) {
          cellPotentials[row] = {}
        }

        cellPotentials[row][col] += Math.abs(threat.score)
      })
    }

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
        value: _.reduce(this.threats.valueSeq().toArray(), (memo, threat) => {
          return memo + (threat ? threat.score : 0)
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
    return _.map(this.values.toJS(), (row) => {
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
  board.settingUp = false;

  return board
}
