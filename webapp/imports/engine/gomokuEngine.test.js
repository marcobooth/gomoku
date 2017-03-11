import _ from "underscore"
import { chai } from 'meteor/practicalmeteor:chai';

import { Board, BOARD_SIZE, getBestMove } from "./gomokuEngine"

var blankBoard = []
_.times(BOARD_SIZE, () => {
  let row = Array(BOARD_SIZE)
  _.times(row.length, (index) => {
    row[index] = null
  })

  blankBoard.push(row)
})

var { assert } = chai

describe('Gomoku engine', function () {
  //                      0123456789
  it('moves from scratch: ..1..43..2.........', function () {
    let startBoard = new Board(blankBoard)

    assert(startBoard.getThreats().length === 0)

    let row = 7
    let board = startBoard.move({ row, col: 2 }).move({ row: 0, col: 0 })
    assert(startBoard.getThreats().length === 0)
    assert(board.getThreats().length === 0)

    // TODO: check in play cells
    // TODO: check we put the piece in the right place,
    // didn't modify startBoard

    board = board.move({ row, col: 9 }).move({ row: 0, col: 10 })
    assert(board.getThreats().length === 0)

    board = board.move({ row, col: 6 }).move({ row: 0, col: 19 })
    let threats = board.getThreats()
    assert.equal(threats.length, 2)
    assert.deepEqual(threats[0], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 6 }, { row, col: 2 } ],
      skipped: [ { row, col: 5 }, { row, col: 4 }, { row, col: 3 } ],
      expansions: [],
      span: 5,
    })
    console.log(threats[1])
    assert.deepEqual(threats[1], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 6 }, { row, col: 9 } ],
      skipped: [ { row, col: 7 }, { row, col: 8 } ],
      expansions: [ { row, col: 5 }, { row, col: 10 } ],
      span: 4,
    })

    board = board.move({ row, col: 5 })
    threats = board.getThreats()
    assert.equal(threats.length, 2)
    console.log(threats[0])
    assert.deepEqual(threats[0], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 6 }, { row, col: 2 }, { row, col: 5 } ],
      skipped: [ { row, col: 4 }, { row, col: 3 } ],
      expansions: [],
      span: 5,
    })
    console.log(threats[1])
    assert.deepEqual(threats[1], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 6 }, { row, col: 9 }, { row, col: 5 } ],
      skipped: [ { row, col: 7 }, { row, col: 8 } ],
      expansions: [ { row, col: 10 } ],
      span: 5,
    })
  })

  //                      01234567890123456789
  it('moves from scratch: .......1234.........', function () {
    let board = new Board(blankBoard)

    let row = 7;
    board = board.move({ row, col: 7 }).move({ row: 0, col: 0 })
    assert.equal(board.getThreats().length, 0)

    board = board.move({ row, col: 8 }).move({ row: 0, col: 10 })
    assert.deepEqual(board.getThreats()[1], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 7 }, { row, col: 8 } ],
      skipped: [],
      expansions: [ { row, col: 6 }, { row, col: 9 } ],
      span: 2,
    })

    board = board.move({ row, col: 8 }).move({ row: 0, col: 19 })
    assert.deepEqual(board.getThreats()[0], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 7 }, { row, col: 8 }, { row, col: 9 } ],
      skipped: [],
      expansions: [ { row, col: 6 }, { row, col: 10 } ],
      span: 3,
    })

    board = board.move({ row, col: 9 }).move({ row: 19, col: 0 })
    assert.deepEqual(board.getThreats()[1], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 7 }, { row, col: 8 }, { row, col: 9 }, { row, col: 10 } ],
      skipped: [],
      expansions: [ { row, col: 6 }, { row, col: 11 } ],
      span: 4,
    })
  })
})
