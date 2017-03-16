import Immutable from "immutable"

// NOTE: we should sort the possible moves based on how many threats they can
// help for the current player and how many they can disrupt for the other
// player

// TODO: put expansions in the cellToThreats? -- perhaps reduce while we're
// going through the threats--make those moves better/worse

export const BOARD_SIZE = 19

// generate some default values

const defaultInPlay = {}
_.times(BOARD_SIZE, (index) => {
  defaultInPlay[index] = {}
})

// define in which ways threats can be found
// NOTE: step functions modify the passed object
const threatFinders = [
  (location, delta) => { location.row += delta }, // down
  (location, delta) => { location.col += delta }, // right
  (location, delta) => {
    location.row += delta; location.col += delta // right-down
  },
  (location, delta) => {
    location.row += delta; location.col -= delta // right-up
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


export class Board {
  // NOTE: player === true means that the player is the maximizing player
  constructor(values, player = true, inPlayCells = defaultInPlay,
        threats = [], cellThreats = defaultCellThreats) {
    this.values = values
    this.player = player
    this.inPlayCells = inPlayCells
    this.threats = threats
    this.cellThreats = cellThreats
  }

  static newThreat(player, finderIndex, location) {
    return {
      player,
      finderIndex,

      // locations where the player has already played
      played: [ location ],

      // locations that need to be "filled in" to complete the 5-in-a-row
      skipped: [],

      // expansion locations on either end
      expansions: [],

      // the size of the threat based on just what's been played
      span: 1,
    }
  }

  static scoreThreat(threat) {
    // TODO
    return 0
  }

  // calculate score, extensions for the threat
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
        // to not have extensions
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

    _.each(oldThreat.played, (location) => {
      newThreat.played.push(location)
    })

    _.each(oldSkipped, (location) => {
      newThreat.skipped.push(location)
    })

    // add non-duplicate values from justSkipped
    _.each(justSkipped, (location) => {
      for (threatLoc of newThreat.skipped) {
        if (threatLoc.row === location.row && threatLoc.col === location.col) {
          return
        }
      }

      newThreat.skipped.push(location)
    })

    // recalculate span
    newThreat.played.sort(Board.compareLocations)
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

  move({ row, col }) {
    // if there's already a piece there, it's an invalid move
    if (this.values[row][col] !== null) return undefined

    // create new values for everything, reusing as much memory as possible
    let newValues = this.values.slice();
    newValues[row] = this.values[row].slice()
    let newThreats = this.threats.slice();
    let newCellThreats = this.cellThreats

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
          let stepCell = threatFinders[finderIndex]
          do {
            stepCell(current, delta)
          } while (newValues[current.row][current.col] === null)

          // check to see if it's already in another threat
          let path = [finderIndex, current.row, current.col]
          if (newCellThreats.getIn(path).size) continue

          // continue the threat from there
          let newThreat = Board.newThreat(!this.player, finderIndex,
              _.clone(current))
          for (var i = 0; i < 4; i++) {
            stepCell(current, delta)

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

    // TODO: remove any captured pieces, figure out if we need to remove any
    // threats due to removal

    // figure out if we need to add/join any threats for the current player
    for (finderIndex in threatFinders) {
      let stepCell = threatFinders[finderIndex]

      // go backwards and then forwards, adding to the threat in each direction,
      // and then do the reverse of all that
      let deltas = [ -1, 1 ]
      let addThreats = []

      // keep track of which threats have been joined and updated
      let joinedThreats = {}
      let updatedThreats = {}

      _.each([ false, true ], (firstBit) => {
        let threat = Board.newThreat(this.player, finderIndex, { row, col })
        let potentialSpan = 1

        // go the other way the second time around
        for (secondBit of [ false, true ]) {
          let current = { row, col }
          let skipped = []

          nextCell:
          for (i = 0; (i < 5) && (threat.span + skipped.length < 5); i++) {
            // clever, eh? http://stackoverflow.com/a/3618366
            stepCell(current, deltas[firstBit ^ secondBit])

            // check to see if we're still on the board
            if (Board.outsideBoard(current)) break

            let value = newValues[current.row][current.col]
            if (value === this.player) {
              // if the cell we're looking at is part of a threat with
              // this finder, check to see if this should join that threat.
              let threatsPath = [finderIndex, current.row, current.col]
              let currentThreats = newCellThreats.getIn(threatsPath)

              for (let threatIndex of currentThreats.keys()) {
                // don't join it if it's already been joined
                // NOTE: joinedThreats has larger scope
                if (joinedThreats[threatIndex]) continue nextCell

                // check to see if we should join that threat
                let potentialLocations = threat.played
                    .concat(threat.skipped).concat(skipped)
                let overlap = _.reduce(potentialLocations, (total, loc) => {
                  let path = [finderIndex, loc.row, loc.col, threatIndex]
                  if (newCellThreats.getIn(path)) {
                    total += 1
                  }

                  return total;
                }, 0)

                let existing = newThreats[threatIndex]
                let toExtend = threat.span + skipped.length - overlap
                if (existing.span + toExtend <= 5) {
                  joinedThreats[threatIndex] = true

                  newCellThreats = Board.mergeThreats(existing, threat,
                      newValues, newCellThreats, threatIndex, skipped)
                  newThreats[threatIndex] = threat

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
              // it's the other player's piece -- time to quit this direction
              // and check if this will disrupt any of their threats
              let threatsPath = [finderIndex, current.row, current.col]
              let threatsHere = newCellThreats.getIn(threatsPath)

              threatsHere.keySeq().forEach(threatIndex => {
                let current = newThreats[threatIndex]
                updated = Board.updateCanExpand(current, newValues)

                if (updated) {
                  newThreats[threatIndex] = updated
                } else {
                  newCellThreats = Board.removeFromCellThreats(threatIndex,
                      current, newCellThreats)
                  delete newThreats[threatIndex]
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
          let threatIndexes = Object.keys(newCellThreats.getIn(path).toJS())
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
        newCellThreats = Board.addThreat(newThreats, newCellThreats, threat,
            newValues)
      })
    }

    // update the in play cells
    let newInPlay = Object.assign({}, this.inPlayCells);
    newInPlay[row] = Object.assign({}, this.inPlayCells[row])

    // remove this cell
    delete newInPlay[row][col]

    // add the cells around it
    for (let r = row - 2; r <= row + 2; r++) {
      if (r < 0 || r >= BOARD_SIZE) continue

      for (let c = col - 2; c <= col + 2; c++) {
        // only add the cell if it's within bounds and blank
        if (c < 0 || c >= BOARD_SIZE || newValues[r][c] === null) continue

        // don't change the parent's information
        if (newInPlay[r] === this.inPlayCells[r]) {
          newInPlay[r] = Object.assign({}, this.inPlayCells[r])
        }

        newInPlay[r][c] = true
      }
    }

    return new Board(newValues, !this.player, newInPlay, newThreats,
        newCellThreats)
  }

  heuristic() {
    return _.reduce(this.threats, (memo, threat) => {
      return memo + threat.score
    }, 0)
  }

  // getters for testing
  getThreats() { return this.threats }
  getCellThreats() { return this.cellThreats }
}
