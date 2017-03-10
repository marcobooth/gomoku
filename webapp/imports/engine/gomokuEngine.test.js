import _ from "underscore"
import { chai } from 'meteor/practicalmeteor:chai';

import { Board, getBestMove } from "./gomokuEngine"

var blankBoard = []
_.times(19, () => {
  let row = Array(19)
  _.times(row.length, (index) => {
    row[index] = null
  })

  blankBoard.push(row)
})

describe('Gomoku engine', function () {
  //                      0123456789
  it('moves from scratch: ..1..43..2.........', function () {
    let startBoard = new Board(blankBoard)

    chai.assert(startBoard.getThreats().length === 0)

    let row = 7
    let board = startBoard.move(row, 2).move(0, 0)
    chai.assert(startBoard.getThreats().length === 0)
    chai.assert(board.getThreats().length === 0)

    // TODO: check in play cells
    // TODO: check we put the piece in the right place,
    // didn't modify startBoard

    board = board.move(row, 9).move(0, 10)
    chai.assert(board.getThreats().length === 0)

    board = board.move(row, 6).move(0, 19)
    let threats = board.getThreats()
    chai.assert(threats.length === 2)
    chai.assert(_.isEqual(threats[0], {
      player: true,
      finderIndex: 1,
      played: [ { row, col: 6 }, { row, col: 2 } ],
      skipped: [ { row, col: 5 }, { row, col: 4 }, { row, col: 3 } ]
      expansions: [],
      span: 5,
    }))
    chai.assert(_.isEqual(threats[0], {
      player: true,
      finderIndex: 1,
      played: [ { row, col: 6 }, { row, col: 9 } ],
      skipped: [ { row, col: 7 }, { row, col: 8 } ]
      expansions: [ { row, col: 5 }, { row, col: 10 } ],
      span: 4,
    }))
  })
})
