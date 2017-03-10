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
  it('moves from scratch: ..1..43..2.........', function () {
    let startBoard = new Board(blankBoard)

    chai.assert(startBoard.getThreats().length === 0)

    let row = 7
    let board = startBoard.move(row, 2)
    chai.assert(startBoard.getThreats().length === 0)
    chai.assert(board.getThreats().length === 0)

    // TODO: check in play cells
    // TODO: check we put the piece in the right place,
    // didn't modify startBoard

    board = board.move(row, 8)
    chai.assert(board.getThreats().length === 0)



    chai.assert.equal(getBestMove(), 3)
  })
})
