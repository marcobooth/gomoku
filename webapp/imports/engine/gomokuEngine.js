// generate the default inPlayCells once
const defaultInPlay = {}
_.times(19, (index) => {
  defaultInPlay[index] = {}
})

class ThreatFinder {
  constructor(description, step)
}

// define in which ways threats can be found
// NOTE: step functions modify the passed object
const threatFinders = [
  (location, delta) => { location.row += delta },
  (location, delta) => { location.col += delta },
  (location, delta) => { location.row += delta; location.col += delta },
  (location, delta) => { location.row += delta; location.col -= delta },
]

export class Board {
  constructor(values, maximizingPlayer = true, inPlayCells = defaultInPlay,
        threats, cellToThreats) {
    this.values = values
    this.maximizingPlayer = maximizingPlayer
    this.inPlayCells = inPlayCells
    this.threats = threats
    this.cellToThreats = cellToThreats
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
      expansions: []

      // the size of the threat based on just what's been played
      span: 1,
    }
  }

  static addCellToThreats(cellToThreats, threat) {
    // TODO
  }

  move({ row, col }) {
    // create new values for everything, reusing as much memory as possible
    let newValues = this.values.slice();
    newValues[row] = this.values[row].slice()

    let player = !this.maximizingPlayer

    let newThreats = this.threats.slice();

    // put the piece down
    newValues[row][col] = maximizingPlayer

    // TODO: remove any captured pieces, figure out if we need to remove any
    // threats due to removal

    // TODO: if this piece was put on one or more threats for this player,
    // update them

    // figure out if we need to add any threats for the current player
    for (finderIndex in threatFinders) {
      let stepCell = threatFinders[finderIndex]

      // go backwards and then forwards, adding to the threat in each direction,
      // and then do the reverse of all that
      let deltas = [ -1, 1 ]

      let directionalThreats = _.map([ true, false ], (firstBit) => {
        let threat = newThreat(player, finderIndex, { row, col })

        // go the other way the second time around
        for (secondBit of [ true, false ]) {
          let current = { row, col }
          let skipped = []

          for (let i = 0; i < 5; i++) {
            // clever, eh? http://stackoverflow.com/a/3618366
            stepCell(current, deltas[firstBit ^ secondBit])

            // check to see if we're still on the board
            if (outsideBoard(current)) {
              break
            }

            let value = newValues[current.row][current.col]
            if (value === player) {
              // it's this player's

              // TODO: if the cell we're looking at is part of a threat with
              // this finder, check to see if this should join that threat.

              // if we skipped any to get here add those too
              // NOTE: threat.played order matters in combineThreats
              threat.played.concat(skipped)
              threat.played.push(current)
              threat.span += 1 + skipped.length
              skipped = []
            } else if (value === null) {
              // it's an empty spot
              skipped.push(current)
            } else {
              // it's the other player's -- time to quit this direction
              break
            }
          }
        }

        return threat
      })

      // check to see if the directional threats are the same
      let combinedThreat = combineThreats(directionalThreats)

      if (combinedThreat) {
        newThreats.push(combinedThreat)
        addCellToThreats(newCellToThreats, combinedThreat)
      } else {
        // add both threats separately
        _.each(directionalThreats, (threat) => {
          newThreats.push(threat)
          addCellToThreats(newCellToThreats, threat)
        })
      }
    }

    // TODO: update the in play cells

    return new Board(newValues, player, newInPlay, newThreats, newCellToThreats)
  }

  static scoreThreat(threat) {
    // TODO: score a threat
    return 10
  }

  heuristic() {
    return _.reduce(this.threats, (memo, threat) => {
      return memo + scoreThreat(threat)
    }, 0)
  }

  // getters for testing
  getThreats() { return this.threats }
}

export function getBestMove(board) {
  // convert from two
  return 3;
}
