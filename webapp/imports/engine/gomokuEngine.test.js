import _ from "underscore"
import { chai } from 'meteor/practicalmeteor:chai';
import Immutable from "immutable"

import { Board, BOARD_SIZE, getBestMove } from "./gomokuEngine"

Im = Immutable


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

    // check the threats
    assert.equal(board.getThreats().length, 2)
    assert.deepEqual(board.getThreats()[0], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 2 }, { row, col: 6 } ],
      skipped: [ { row, col: 5 }, { row, col: 4 }, { row, col: 3 } ],
      expansions: [],
      span: 5,
    })
    assert.deepEqual(board.getThreats()[1], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 6 }, { row, col: 9 } ],
      skipped: [ { row, col: 7 }, { row, col: 8 } ],
      expansions: [ { row, col: 5 }, { row, col: 10 } ],
      span: 4,
    })

    // check cellThreats
    let rowSeven = board.getCellThreats().getIn([1, 7])
    assert.deepEqual(rowSeven.get(0).toJS(), {})
    assert.deepEqual(rowSeven.get(1).toJS(), {})
    assert.deepEqual(rowSeven.get(2).toJS(), { 0: true })
    assert.deepEqual(rowSeven.get(3).toJS(), { 0: true })
    assert.deepEqual(rowSeven.get(4).toJS(), { 0: true })
    assert.deepEqual(rowSeven.get(5).toJS(), { 0: true })
    assert.deepEqual(rowSeven.get(6).toJS(), { 0: true, 1: true })
    assert.deepEqual(rowSeven.get(7).toJS(), { 1: true })
    assert.deepEqual(rowSeven.get(8).toJS(), { 1: true })
    assert.deepEqual(rowSeven.get(9).toJS(), { 1: true })
    assert.deepEqual(rowSeven.get(10).toJS(), {})

    board = board.move({ row, col: 5 })
    assert.equal(board.getThreats().length, 2)
    assert.deepEqual(board.getThreats()[0], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 2 }, { row, col: 5 }, { row, col: 6 } ],
      skipped: [ { row, col: 4 }, { row, col: 3 } ],
      expansions: [],
      span: 5,
    })
    assert.deepEqual(board.getThreats()[1], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 5 }, { row, col: 6 }, { row, col: 9 } ],
      skipped: [ { row, col: 7 }, { row, col: 8 } ],
      expansions: [],
      span: 5,
    })
  })

  //                      01234567890123456789
  it('moves from scratch: .......1235...4.....', function () {
    let board = new Board(blankBoard)

    let row = 7;
    board = board.move({ row, col: 7 }).move({ row: 0, col: 0 })
    assert.equal(board.getThreats().length, 0)

    board = board.move({ row, col: 8 }).move({ row: 0, col: 10 })
    assert.equal(board.getThreats().length, 1)
    assert.deepEqual(board.getThreats()[0], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 7 }, { row, col: 8 } ],
      skipped: [],
      expansions: [ { row, col: 6 }, { row, col: 9 } ],
      span: 2,
    })

    board = board.move({ row, col: 9 }).move({ row: 0, col: 18 })
    assert.equal(board.getThreats().length, 1)
    assert.deepEqual(board.getThreats()[0], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 7 }, { row, col: 8 }, { row, col: 9 } ],
      skipped: [],
      expansions: [ { row, col: 6 }, { row, col: 10 } ],
      span: 3,
    })

    board = board.move({ row, col: 14 }).move({ row: 18, col: 0 })
        .move({ row, col: 10 })//.move({ row: 18, col: 10 })
    assert.equal(board.getThreats().length, 2)
    assert.deepEqual(board.getThreats()[0], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 7 }, { row, col: 8 }, { row, col: 9 }, { row, col: 10 } ],
      skipped: [],
      expansions: [ { row, col: 6 }, { row, col: 11 } ],
      span: 4,
    })
    assert.deepEqual(board.getThreats()[1], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 10 }, { row, col: 14 } ],
      skipped: [ { row, col: 11 }, { row, col: 12 }, { row, col: 13 } ],
      expansions: [],
      span: 5,
    })
  })

  //                      01234567890123456789
  it('moves from scratch: .......1.3.2.........', function () {
    let board = new Board(blankBoard)

    let row = 7;
    board = board.move({ row, col: 7 }).move({ row: 0, col: 0 })
        .move({ row, col: 11 }).move({ row: 0, col: 10 })
    assert.equal(board.getThreats().length, 1)
    assert.deepEqual(board.getThreats()[0], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 7 }, { row, col: 11 } ],
      skipped: [ { row, col: 10 }, { row, col: 9 }, { row, col: 8 } ],
      expansions: [],
      span: 5,
    })

    board = board.move({ row, col: 9 })
    assert.equal(board.getThreats().length, 1)
    assert.deepEqual(board.getThreats()[0], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 7 }, { row, col: 9 }, { row, col: 11 } ],
      skipped: [ { row, col: 10 }, { row, col: 8 } ],
      expansions: [],
      span: 5,
    })
  })

  //                      01234567890123456789
  it('moves from scratch: .....12..3..........', function () {
    let board = new Board(blankBoard)

    let row = 7;
    board = board.move({ row, col: 5 }).move({ row: 0, col: 0 })
        .move({ row, col: 6 }).move({ row: 0, col: 10 })
        .move({ row, col: 9 })

    assert.equal(board.getThreats().length, 1)
    // XXX isn't seeming to add the skipped cells if we merge...
    console.log("board.getThreats()[0]:", board.getThreats()[0]);
    assert.deepEqual(board.getThreats()[0], {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 5 }, { row, col: 6 }, { row, col: 9 } ],
      skipped: [ { row, col: 8 }, { row, col: 7 } ],
      expansions: [],
      span: 5,
    })
  })

  // //                      01234567890123456789
  // it('moves from scratch: .......3..12........', function () {
  //   let board = new Board(blankBoard)
  //
  //   let row = 7;
  //   board = board.move({ row, col: 10 }).move({ row: 0, col: 0 })
  //       .move({ row, col: 11 }).move({ row: 0, col: 10 })
  //       .move({ row, col: 7 })
  //
  //   assert.equal(board.getThreats().length, 1)
  //   assert.deepEqual(board.getThreats()[0], {
  //     player: true,
  //     finderIndex: "1",
  //     // NOTE: might need to sort here
  //     played: [ { row, col: 7 }, { row, col: 10 }, { row, col: 11 } ],
  //     skipped: [ { row, col: 8 }, { row, col: 9 } ],
  //     expansions: [],
  //     span: 5,
  //   })
  // })

  // // force checking both threats on side to merge
  // //                      01234567890123456789
  // it('moves from scratch: ...3..14.2.........', function () {
  //   // TODO: won't join the treat created by the 3rd move
  // })
})
