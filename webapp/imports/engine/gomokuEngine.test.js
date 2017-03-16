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
  it("doesn't accept invalid moves", function () {
    let board = new Board(blankBoard)
        .move({ row: 0, col: 0 })
        .move({ row: 0, col: 0 })

    assert.equal(board, undefined)
  })

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

    board = board.move({ row, col: 6 }).move({ row: 0, col: 18 })

    // check the threats
    assert.equal(board.getThreats().length, 2)
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 2 }, { row, col: 6 } ],
      skipped: [ { row, col: 5 }, { row, col: 4 }, { row, col: 3 } ],
      expansions: [],
      span: 5,
    })
    assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
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
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 2 }, { row, col: 5 }, { row, col: 6 } ],
      skipped: [ { row, col: 4 }, { row, col: 3 } ],
      expansions: [],
      span: 5,
    })
    assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
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
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 7 }, { row, col: 8 } ],
      skipped: [],
      expansions: [ { row, col: 6 }, { row, col: 9 } ],
      span: 2,
    })

    board = board.move({ row, col: 9 }).move({ row: 0, col: 18 })
    assert.equal(board.getThreats().length, 1)
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
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
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 7 }, { row, col: 8 }, { row, col: 9 }, { row, col: 10 } ],
      skipped: [],
      expansions: [ { row, col: 6 }, { row, col: 11 } ],
      span: 4,
    })
    assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
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
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 7 }, { row, col: 11 } ],
      skipped: [ { row, col: 10 }, { row, col: 9 }, { row, col: 8 } ],
      expansions: [],
      span: 5,
    })

    board = board.move({ row, col: 9 })
    assert.equal(board.getThreats().length, 1)
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
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
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 5 }, { row, col: 6 }, { row, col: 9 } ],
      skipped: [ { row, col: 8 }, { row, col: 7 } ],
      expansions: [],
      span: 5,
    })
  })

  //                      01234567890123456789
  it('moves from scratch: .......3..12........', function () {
    let board = new Board(blankBoard)

    let row = 7;
    board = board.move({ row, col: 10 }).move({ row: 0, col: 0 })
                .move({ row, col: 11 }).move({ row: 0, col: 10 })
                .move({ row, col: 7 })

    assert.equal(board.getThreats().length, 1)
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 7 }, { row, col: 10 }, { row, col: 11 } ],
      skipped: [ { row, col: 8 }, { row, col: 9 } ],
      expansions: [],
      span: 5,
    })
  })

  // force checking both threats on side to merge
  //                      01234567890123456789
  it('moves from scratch: ...3..14.2.........', function () {
    let board = new Board(blankBoard)

    let row = 7;
    board = board.move({ row, col: 6 }).move({ row: 0, col: 0 })
                .move({ row, col: 9 }).move({ row: 0, col: 10 })
                .move({ row, col: 3 }).move({ row: 0, col: 18 })
                .move({ row, col: 7 })

    assert.equal(board.getThreats().length, 2)
  })

  it("don't join threats of opposite player", function () {
    let board = new Board(blankBoard)

    let col = 4
    board = board.move({ row: 8, col }).move({ row: 9, col })
                .move({ row: 7, col }).move({ row: 10, col })
    assert.equal(board.getThreats().length, 2)
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
      player: true,
      finderIndex: "0",
      played: [ { row: 7, col }, { row: 8, col } ],
      skipped: [],
      expansions: [ { row: 6, col } ],
      span: 2,
    })
    assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
      player: false,
      finderIndex: "0",
      played: [ { row: 9, col }, { row: 10, col } ],
      skipped: [],
      expansions: [ { row: 11, col } ],
      span: 2,
    })
  })

  // make sure threats that don't have space aren't recorded
  it("doesn't find threats that can't expand", function () {
    let board = new Board(blankBoard)

    board = board.move({ row: 0, col: 1 }).move({ row: 17, col: 16 })
                .move({ row: 1, col: 0 }).move({ row: 16, col: 17 })
    assert.equal(board.getThreats().length, 0)
  })

  it("removes threats that can no longer expand", function () {
    let board = new Board(blankBoard)

    let col = 4
    board = board.move({ row: 5, col }).move({ row: 7, col })
                .move({ row: 6, col })
    assert.equal(board.getThreats().length, 1)
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
      player: true,
      finderIndex: "0",
      played: [ { row: 5, col }, { row: 6, col } ],
      skipped: [],
      expansions: [ { row: 4, col } ],
      span: 2,
    })

    // block the true player from expanding
    board = board.move({ row: 2, col })
    assert.equal(board.getThreats().length, 1)
    assert.equal(board.getThreats()[0], undefined)
  })

  it("splits threats that are broken in two", function () {
    let board = new Board(blankBoard)

    let row = 4
    board = board.move({ row, col: 3 }).move({ col: 0, row: 0 })
                .move({ row, col: 4 }).move({ col: 0, row: 10 })
                .move({ row, col: 6 }).move({ col: 0, row: 18 })
                .move({ row, col: 7 })

    assert.equal(board.getThreats().length, 1)
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
      player: true,
      finderIndex: "1",
      played: [
        { row, col: 3 },
        { row, col: 4 },
        { row, col: 6 },
        { row, col: 7 },
      ],
      skipped: [ { row, col: 5 } ],
      expansions: [],
      span: 5,
    })

    // bisect the threat (false to move)
    board = board.move({ row, col: 5 })
    assert.equal(board.getThreats().length, 3)
    assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 3 }, { row, col: 4 }, ],
      skipped: [],
      expansions: [ { row, col: 2 } ],
      span: 2,
    })
    assert.deepEqual(_.omit(board.getThreats()[2], "score"), {
      player: true,
      finderIndex: "1",
      played: [ { row, col: 6 }, { row, col: 7 }, ],
      skipped: [],
      expansions: [ { row, col: 8 } ],
      span: 2,
    })
  })

  it("splits threats that are broken in two part 2", function () {
    let board = new Board(blankBoard)

    let col = 4
    board = board.move({ row: 3, col }).move({ row: 0, col: 0 })
                .move({ row: 4, col }).move({ row: 0, col: 10 })
                .move({ row: 6, col }).move({ row: 0, col: 18 })
                .move({ row: 7, col }).move({ row: 18, col: 0 })
                .move({ row: 9, col })

    assert.equal(board.getThreats().length, 2)
    assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
      player: true,
      finderIndex: "0",
      played: [
        { row: 3, col },
        { row: 4, col },
        { row: 6, col },
        { row: 7, col },
      ],
      skipped: [ { row: 5, col } ],
      expansions: [],
      span: 5,
    })
    assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
      player: true,
      finderIndex: "0",
      played: [ { row: 6, col }, { row: 7, col }, { row: 9, col } ],
      skipped: [ { row: 8, col } ],
      expansions: [ { row: 5, col }, { row: 10, col } ],
      span: 4,
    })

    // bisect the threat (false to move)
    board = board.move({ row: 5, col })
    assert.equal(board.getThreats().length, 3)
    assert.deepEqual(_.omit(board.getThreats()[2], "score"), {
      player: true,
      finderIndex: "0",
      played: [ { row: 3, col }, { row: 4, col }, ],
      skipped: [],
      expansions: [ { row: 2, col } ],
      span: 2,
    })
    assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
      player: true,
      finderIndex: "0",
      played: [ { row: 6, col }, { row: 7, col }, { row: 9, col } ],
      skipped: [ { row: 8, col } ],
      expansions: [ { row: 10, col } ],
      span: 4,
    })
  })

  // it("a normal game", function () {
  //   let board = new Board(blankBoard)
  //
  //   board = board.move({ row: 8, col: 9 })
  //   board = board.move({ row: 9, col: 8 })
  //   board = board.move({ row: 9, col: 9 })
  //   board = board.move({ row: 10, col: 9 })
  //   board = board.move({ row: 10, col: 8 })
  //   board = board.move({ row: 11, col: 10 })
  //   board = board.move({ row: 10, col: 9 })
  //   board = board.move({ row: 10, col: 9 })
  //   board = board.move({ row: 10, col: 9 })
  //   board = board.move({ row: 10, col: 9 })
  //   board = board.move({ row: 10, col: 9 })
  //   board = board.move({ row: 10, col: 9 })
  //   board = board.move({ row: 10, col: 9 })
  //   board = board.move({ row: 10, col: 9 })
  //   board = board.move({ row: 10, col: 9 })
  // })
})
