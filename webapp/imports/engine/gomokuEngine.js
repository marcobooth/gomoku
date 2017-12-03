import Immutable from "immutable"

// NOTE: if I were to recode this, I wouldn't have made Board objects
// immutable. This would greatly simplify the logic required in Board.move().

export const BOARD_SIZE = 19

// generate some default values

const defaultInPlay = new Immutable.Map()


// Utilities
function printCellThreats(cellThreats) {
  console.log("cell threats:");
  cellThreats.entrySeq().forEach(([finderKey, values]) => {
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

var jsCellThreats = Array(threatFinders.length);
_.times(threatFinders.length, (finderIndex) => {
  jsCellThreats[finderIndex] = Array(BOARD_SIZE)

  _.times(BOARD_SIZE, (row) => {
    jsCellThreats[finderIndex][row] = Array(BOARD_SIZE)

    _.times(BOARD_SIZE, (col) => {
      jsCellThreats[finderIndex][row][col] = {}
    })
  })
})
const defaultCellThreats = Immutable.fromJS(jsCellThreats)

const defaultStringMap = {
  true: "white",
  false: "black",
}

export const blankValues = []
_.times(BOARD_SIZE, () => {
  let row = Array(BOARD_SIZE)
  _.times(row.length, (index) => {
    row[index] = null
  })

  blankValues.push(row)
})

// should be referenced as such:
// playedExtensions[played.length][expansions.length]
// TODO: take into account skipped
const playedExtensions = {
  2: { 0: 0, 1: 1, 2: 4 },
  3: { 0: 0, 1: 20, 2: 300 },
  4: { 0: 0, 1: 1000, 2: 1000000 },
  5: {
    0: Number.POSITIVE_INFINITY,
    1: Number.POSITIVE_INFINITY,
    2: Number.POSITIVE_INFINITY,
  },
}

export class Board {
  // NOTE: player === true means that the player is the maximizing player
  constructor(player = true, toStringMap = defaultStringMap, values,
        inPlayCells = defaultInPlay,
        threats = [],
        cellThreats = defaultCellThreats,
        winningThreat) {
    if (values) {
      this.values = values
    } else {
      this.values = JSON.parse(JSON.stringify(blankValues))
    }

    this.player = player
    this.inPlayCells = inPlayCells
    this.threats = threats
    this.cellThreats = cellThreats
    this.winningThreat = winningThreat
    this.toStringMap = toStringMap
  }

  static newThreat(player, finderIndex) {
    return {
      player,
      finderIndex,

      // locations where the player has already played
      played: [],

      // locations that need to be "filled in" to complete the 5-in-a-row
      skipped: [],

      // expansion locations on either end
      expansions: [],

      // the size of the threat based on just what's been played
      span: 0,
    }
  }

  static scoreThreat(threat) {
    let { played, expansions, player } = threat

    let score = playedExtensions[played.length][expansions.length]

    return score * (player ? 1 : -1)
  }

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

    threat.score = Board.scoreThreat(threat)
  }

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

  static removeFromCellThreats(threatIndex, threat, newCellThreats) {
    _.each(threat.played.concat(threat.skipped), (location) => {
      let path = [threat.finderIndex, location.row, location.col, threatIndex]
      newCellThreats = newCellThreats.deleteIn(path)
    })

    return newCellThreats
  }

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
        for (secondBit of [ false, true ]) {
          let current = { row, col }
          let skipped = []
          if (values[row][col] === null && secondBit === false) {
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

                  cellThreats = Board.mergeThreats(existing, threat,
                      values, cellThreats, threatIndex, skipped)
                  threats[threatIndex] = threat

                  if (threat.played.length === 5) {
                    winningThreat = threat
                  }

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

  move({ row, col }) {
    // if there's already a piece there, it's an invalid move
    if (this.values[row][col] !== null) return undefined

    // create new values for everything, reusing as much memory as possible
    let newValues = this.values.slice();
    newValues[row] = this.values[row].slice()
    let newThreats = this.threats.slice();
    let newCellThreats = this.cellThreats
    let winningThreat = this.winningThreat

    // put the piece down
    newValues[row][col] = this.player

    // check if we need to split any threats
    for (finderIndex in threatFinders) {
      let threatsHere = newCellThreats.getIn([finderIndex, row, col])

      for ([threatIndex, player] of threatsHere.entrySeq()) {
        if (player !== this.player) {
          newCellThreats = Board.removeFromCellThreats(threatIndex,
              newThreats[threatIndex], newCellThreats)

          delete newThreats[threatIndex]
        }

        // search in both directions to recreate the threats
        for (delta of [-1, 1]) {
          let played = []
          let skipped = []

          // find the first opposition piece
          let current = { row, col }
          do {
            threatFinders[finderIndex](current, delta)
          } while (!Board.outsideBoard(current) &&
              newValues[current.row][current.col] === null)

          if (Board.outsideBoard(current)) continue;

          // check to see if it's already in another threat
          let path = [finderIndex, current.row, current.col]
          if (!newCellThreats.getIn(path)) {
            console.log("Found where it crashes!");
            console.log("current:", current);
            console.log("finderIndex:", finderIndex);
            printCellThreats(newCellThreats)
          }
          if (newCellThreats.getIn(path).size) continue

          // continue the threat from there
          let newThreat = Board.newThreat(!this.player, finderIndex)
          newThreat.played.push(_.clone(current))
          newThreat.span++

          for (var i = 0; i < 4; i++) {
            threatFinders[finderIndex](current, delta)

            if (Board.outsideBoard(current)) break

            let value = newValues[current.row][current.col]
            if (value === !this.player) {
              newThreat.played.push(_.clone(current))
              newThreat.skipped = newThreat.skipped.concat(skipped)
              newThreat.span += 1 + skipped.length
              skipped = []
            } else if (value === null) {
              skipped.push(_.clone(current))
            } else {
              break
            }
          }

          // if the found threat is big enough, add it to the list
          if (newThreat.played.length > 1) {
            newThreat.played.sort(Board.compareLocations)
            newCellThreats = Board.addThreat(newThreats, newCellThreats,
                newThreat, newValues)
          }
        }
      }
    }

    let newInfo = Board.updateThreatsAround(this.player, { row, col },
        newValues, newThreats, newCellThreats, winningThreat)
    newCellThreats = newInfo.cellThreats
    winningThreat = newInfo.winningThreat

    // update in play cells
    let newInPlay = this.inPlayCells.deleteIn([row, col])

    // add the cells around it
    for (let r = row - 1; r <= row + 1; r++) {
      if (r < 0 || r >= BOARD_SIZE) continue

      for (let c = col - 1; c <= col + 1; c++) {
        if (c < 0 || c >= BOARD_SIZE || newValues[r][c] !== null) continue

        newInPlay = newInPlay.setIn([r, c], true)
      }
    }

    return new Board(!this.player, this.toStringMap, newValues, newInPlay,
        newThreats, newCellThreats, winningThreat)
  }

  heuristic() {
    return _.reduce(this.threats, (memo, threat) => {
      return memo + threat.score
    }, 0)
  }

  hasWinner() { return !!this.winningThreat }
  getWinningThreat() {
    return this.winningThreat || {}
  }

  getMoves() {
    // sort the possible moves based on how many threats they can help
    // for the current player and how many they can disrupt for the other
    // player
    let cellMoves = this.inPlayCells.toJS()
    _.each(cellMoves, (rowColumns, row) => {
      _.each(rowColumns, (value, col) => {
        cellMoves[row][col] = 0
      })
    })

    // console.log("cellMoves before:", cellMoves);

    _.each(this.threats, (threat, threatIndex) => {
      // console.log("threatIndex:", threatIndex);
      // console.log("_.pick(threat, 'score', 'skipped', 'expansions'):", _.pick(threat, 'score', 'skipped', 'expansions'));
      let addToScore = ({ row, col }) => {
        if (!cellMoves[row]) {
          cellMoves[row] = {}
        }

        cellMoves[row][col] += Math.abs(threat.score)
        // console.log(`cellMoves[${row}][${col}]:`, cellMoves[row][col]);
      }

      _.each(threat.skipped, addToScore)
      _.each(threat.expansions, addToScore)
    })

    // console.log("cellMoves after:", cellMoves);

    let moves = []
    _.each(cellMoves, (colValues, row) => {
      row = parseInt(row)

      _.each(colValues, (score, col) => {
        moves.push({
          score,
          row,
          col: parseInt(col)
        })
      })
    })

    let sorted = moves.sort((first, second) => {
      return second.score - first.score
    })

    return sorted
  }

  static compareABValues(compare, first, second) {
    if (compare(first.value, second.value) === first.value) {
      return first
    }

    return second
  }

  alphabeta(depth, alpha, beta) {
    // console.log("    ".repeat(GLOBAL_DEPTH - depth), `alpha=${alpha}, beta=${beta}`)

    if (depth === 0 || this.hasWinner()) {
      let value = this.heuristic()
      // console.log("    ".repeat(GLOBAL_DEPTH - depth), "heuristic:", value)

      return { value }
    }

    let valueAndMove = {
      value: this.player ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    }

    let moves = this.getMoves()

    // console.log("    ".repeat(GLOBAL_DEPTH - depth), `moves count: ${moves.length}`)
    for (let move of moves) {
      if (depth >= 3) {
        console.log("    ".repeat(GLOBAL_DEPTH - depth), `MOVE for ${this.player}:`, move)
        console.log("this.toString():", this.toString());
      }
      // if (move.score === 300 && move.row === 9 && move.col === 7) {
      //   console.log("this.toString():", this.toString());
      // }

      let child = {
        value: this.move(move).alphabeta(depth - 1, alpha, beta).value,
        move,
      }

      if (this.player) {
        valueAndMove = Board.compareABValues(Math.max, valueAndMove, child)
        alpha = Math.max(alpha, valueAndMove.value)
        // console.log("    ".repeat(GLOBAL_DEPTH - depth), `new alpha: ${alpha}`)
      } else {
        valueAndMove = Board.compareABValues(Math.min, valueAndMove, child)
        beta = Math.min(beta, valueAndMove.value)
        // console.log("    ".repeat(GLOBAL_DEPTH - depth), `new beta: ${beta}`)
      }

      if (beta <= alpha) {
        // console.log("    ".repeat(GLOBAL_DEPTH - depth), "beta <= alpha -- breaking")
        break
      }
    }

    // console.log("    ".repeat(GLOBAL_DEPTH - depth), "returning:", valueAndMove)

    return valueAndMove
  }

  getBestMove() {
    // hardcoded starting move
    if (this.inPlayCells.size === 0) {
      return { row: 8, col: 8 }
    }

    return _.omit(this.alphabeta(GLOBAL_DEPTH, Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY).move, "score")
  }

  // return the thing we get from the input (strings)
  getStringBoard() {
    return _.map(this.values, (row) => {
      return _.map(row, (value) => {
        return this.toStringMap[value] || null
      })
    })
  }

  static boardValuesToString(boardValues, singleCharMap) {
    return "    " + [...Array(19).keys()]
        .map(number => String(number).slice(-1))
        .join(" ") + "\n" +
      _.reduce(boardValues, (memo, rowValues, rowIndex) => {
        return memo + `${String(rowIndex).padStart(2)}: ` +
            _.map(rowValues, (value) => {
              return singleCharMap[value] || "."
            }).join(" ") + "\n"
      }, "")
  }

  singleCharMap() {
    return {
      true: this.toStringMap[true].substring(0, 1),
      false: this.toStringMap[false].substring(0, 1),
    }
  }

  toString() {
    let singleCharMap = this.singleCharMap()

    // might have next move off
    return `next move will be by ${this.toStringMap[this.player]}\n` +
        `${singleCharMap[true]} = ${this.toStringMap[true]}\n` +
        `${singleCharMap[false]} = ${this.toStringMap[false]}\n` +
        Board.boardValuesToString(this.values, singleCharMap)
  }

  // getters for testing
  getThreats() { return this.threats }
  getCellThreats() { return this.cellThreats }
  getInPlayCells() { return this.inPlayCells.toJS() }
  getValues() { return this.values }
  getPlayer() { return this.player }
}

logging = false
var GLOBAL_DEPTH = 3

export function createEngineState(nextPlayer, otherPlayer, colorValues) {
  // convert colorValues to something we can feed into the move function
  let playerMoves = {
    [ otherPlayer ]: [],
    [ nextPlayer ]: [],
  }

  for (let row in colorValues) {
    for (let col in colorValues[row]) {
      let value = colorValues[row][col]

      if (value) {
        if (!playerMoves[value]) {
          playerMoves[value] = []
        }

        playerMoves[value].push({
          row: parseInt(row),
          col: parseInt(col)
        })
      }
    }
  }

  // first in players went first (important below)
  let players
  if (playerMoves[nextPlayer].length < playerMoves[otherPlayer].length) {
    players = [ otherPlayer, nextPlayer ]
  } else if (playerMoves[nextPlayer].length > playerMoves[otherPlayer].length) {
    players = [ nextPlayer, otherPlayer ]
  } else {
    players = [ otherPlayer, nextPlayer ]
  }

  let toStringMap = {
    true: nextPlayer,
    false: otherPlayer,
  }
  let board = new Board(players[0] === nextPlayer, toStringMap)

  // recreate board move by move
  let count = 0
  for (moveIndex in playerMoves[players[0]]) {
    board = board.move(playerMoves[players[0]][moveIndex])

    if (moveIndex < playerMoves[players[1]].length) {
      board = board.move(playerMoves[players[1]][moveIndex])
    }
  }

  return board
}
