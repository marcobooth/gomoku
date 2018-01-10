import _ from "underscore"
import { chai } from 'meteor/practicalmeteor:chai';
import Immutable from "immutable"

import { Board, createEngineState, blankValues } from "./gomokuEngine"

Im = Immutable

var { assert } = chai

describe('Gomoku engine', function () {
  it("splitting threats doesn't leave behind orphan threats", function () {
    let boardValues = [
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      // [null,null,null,null,null,null,null,"ME","ME",null,"ME","ME","ME",null,null,null,null,null,null],
      [null,null,null,null,null,null,null,"ME","ME",null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    ]

    let board = createEngineState("AI", "ME", boardValues)
    console.log("board.toString():", board.toString());

    // let newBoard = board.move({ row: 6, col: 9 })
    // console.log("newBoard.toString():", newBoard.toString());



    // TODO: check the threats

    // TODO: check the result doesn't have orphans

    assert.equal(true, false)
  })

  // it("make sure joining works 1", function () {
  //   let boardValues = [
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,"ME","ME",null,null,"ME","ME","ME",null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //   ]
  //
  //   let board = createEngineState("ME", "AI", boardValues)
  //   console.log("board:", board);
  //
  //   let newBoard = board.move({ row: 6, col: 9 })
  //   console.log("newBoard:", newBoard);
  //
  //   // TODO: copy this test, move one col less, flip two and three and duplicate again
  //
  //   // TODO: check the threats
  //
  //   // TODO: check the result doesn't have orphans
  //
  //   assert.equal(true, false)
  // })
  //
  // it("make sure joining works 1", function () {
  //   let boardValues = [
  //     [null,"ME",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     ["AI","ME","ME","AI",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,"ME",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //   ]
  //
  //   let board = createEngineState("AI", "ME", boardValues)
  //   assert.deepEquals(board.getThreats().toJS(), [
  //     {
  //       player: false,
  //       finderIndex: 0,
  //       played: [
  //         { row: 0, col: 1 },
  //         { row: 1, col: 1 },
  //         { row: 2, col: 1 },
  //       ],
  //       expansions: 1,
  //       span: 3,
  //     },
  //     {
  //       player: false,
  //       finderIndex: 1,
  //       played: [
  //         { row: 1, col: 1 },
  //         { row: 1, col: 2 },
  //       ],
  //       expansions: 1,
  //       span: 2,
  //     },
  //   ])
  //
  //   let newBoard = board.move({ row: 1, col: 3 })
  //   assert.deepEquals(board.getThreats().toJS(), [
  //     {
  //       player: false,
  //       finderIndex: 0,
  //       played: [
  //         { row: 0, col: 1 },
  //         { row: 2, col: 1 },
  //       ],
  //       expansions: 1,
  //       span: 3,
  //     },
  //     // TODO: the AI threat
  //   ])
  // })

  // it("doesn't accept invalid moves", function () {
  //   let board = new Board()
  //       .move({ row: 0, col: 0 })
  //       .move({ row: 0, col: 0 })
  //
  //   assert.equal(board, undefined)
  // })
  //
  // //                      0123456789
  // it('moves from scratch: ..1..43..2.........', function () {
  //   let startBoard = new Board()
  //
  //   assert(startBoard.getThreats().length === 0)
  //
  //   let row = 7
  //   let board = startBoard.move({ row, col: 2 }).move({ row: 0, col: 0 })
  //   assert(startBoard.getThreats().length === 0)
  //   assert(board.getThreats().length === 0)
  //
  //   // TODO: check in play cells
  //   // TODO: check we put the piece in the right place,
  //   // didn't modify startBoard
  //
  //   board = board.move({ row, col: 9 }).move({ row: 0, col: 10 })
  //   assert(board.getThreats().length === 0)
  //
  //   board = board.move({ row, col: 6 }).move({ row: 0, col: 18 })
  //
  //   // check the threats
  //   assert.equal(board.getThreats().length, 2)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 2 }, { row, col: 6 } ],
  //     skipped: [ { row, col: 3 }, { row, col: 4 }, { row, col: 5 } ],
  //     expansions: [],
  //     span: 5,
  //   })
  //   assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 6 }, { row, col: 9 } ],
  //     skipped: [ { row, col: 7 }, { row, col: 8 } ],
  //     expansions: [ { row, col: 5 }, { row, col: 10 } ],
  //     span: 4,
  //   })
  //
  //   // check cellThreats
  //   let rowSeven = board.getCellThreats().getIn([1, 7])
  //   assert.deepEqual(rowSeven.get(0).toJS(), {})
  //   assert.deepEqual(rowSeven.get(1).toJS(), {})
  //   assert.deepEqual(rowSeven.get(2).toJS(), { 0: true })
  //   assert.deepEqual(rowSeven.get(3).toJS(), { 0: true })
  //   assert.deepEqual(rowSeven.get(4).toJS(), { 0: true })
  //   assert.deepEqual(rowSeven.get(5).toJS(), { 0: true })
  //   assert.deepEqual(rowSeven.get(6).toJS(), { 0: true, 1: true })
  //   assert.deepEqual(rowSeven.get(7).toJS(), { 1: true })
  //   assert.deepEqual(rowSeven.get(8).toJS(), { 1: true })
  //   assert.deepEqual(rowSeven.get(9).toJS(), { 1: true })
  //   assert.deepEqual(rowSeven.get(10).toJS(), {})
  //
  //   board = board.move({ row, col: 5 })
  //   assert.equal(board.getThreats().length, 2)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 2 }, { row, col: 5 }, { row, col: 6 } ],
  //     skipped: [ { row, col: 3 }, { row, col: 4 } ],
  //     expansions: [],
  //     span: 5,
  //   })
  //   assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 5 }, { row, col: 6 }, { row, col: 9 } ],
  //     skipped: [ { row, col: 7 }, { row, col: 8 } ],
  //     expansions: [],
  //     span: 5,
  //   })
  // })
  //
  // //                      01234567890123456789
  // it('moves from scratch: .......1235...4.....', function () {
  //   let board = new Board()
  //
  //   let row = 7;
  //   board = board.move({ row, col: 7 }).move({ row: 0, col: 0 })
  //   assert.equal(board.getThreats().length, 0)
  //
  //   board = board.move({ row, col: 8 }).move({ row: 0, col: 10 })
  //   assert.equal(board.getThreats().length, 1)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 7 }, { row, col: 8 } ],
  //     skipped: [],
  //     expansions: [ { row, col: 6 }, { row, col: 9 } ],
  //     span: 2,
  //   })
  //
  //   board = board.move({ row, col: 9 }).move({ row: 0, col: 18 })
  //   assert.equal(board.getThreats().length, 1)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 7 }, { row, col: 8 }, { row, col: 9 } ],
  //     skipped: [],
  //     expansions: [ { row, col: 6 }, { row, col: 10 } ],
  //     span: 3,
  //   })
  //
  //   board = board.move({ row, col: 14 }).move({ row: 18, col: 0 })
  //               .move({ row, col: 10 })//.move({ row: 18, col: 10 })
  //   assert.equal(board.getThreats().length, 2)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 7 }, { row, col: 8 }, { row, col: 9 }, { row, col: 10 } ],
  //     skipped: [],
  //     expansions: [ { row, col: 6 }, { row, col: 11 } ],
  //     span: 4,
  //   })
  //   assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 10 }, { row, col: 14 } ],
  //     skipped: [ { row, col: 11 }, { row, col: 12 }, { row, col: 13 } ],
  //     expansions: [],
  //     span: 5,
  //   })
  // })
  //
  // //                      01234567890123456789
  // it('moves from scratch: .......1.3.2.........', function () {
  //   let board = new Board()
  //
  //   let row = 7;
  //   board = board.move({ row, col: 7 }).move({ row: 0, col: 0 })
  //               .move({ row, col: 11 }).move({ row: 0, col: 10 })
  //   assert.equal(board.getThreats().length, 1)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 7 }, { row, col: 11 } ],
  //     skipped: [ { row, col: 8 }, { row, col: 9 }, { row, col: 10 } ],
  //     expansions: [],
  //     span: 5,
  //   })
  //
  //   board = board.move({ row, col: 9 })
  //   assert.equal(board.getThreats().length, 1)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 7 }, { row, col: 9 }, { row, col: 11 } ],
  //     skipped: [ { row, col: 8 }, { row, col: 10 } ],
  //     expansions: [],
  //     span: 5,
  //   })
  // })
  //
  // //                      01234567890123456789
  // it('moves from scratch: .....12..3..........', function () {
  //   let board = new Board()
  //
  //   let row = 7;
  //   board = board.move({ row, col: 5 }).move({ row: 0, col: 0 })
  //               .move({ row, col: 6 }).move({ row: 0, col: 10 })
  //               .move({ row, col: 9 })
  //   assert.equal(board.getThreats().length, 1)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 5 }, { row, col: 6 }, { row, col: 9 } ],
  //     skipped: [ { row, col: 7 }, { row, col: 8 } ],
  //     expansions: [],
  //     span: 5,
  //   })
  // })
  //
  // //                      01234567890123456789
  // it('moves from scratch: .......3..12........', function () {
  //   let board = new Board()
  //
  //   let row = 7;
  //   board = board.move({ row, col: 10 }).move({ row: 0, col: 0 })
  //               .move({ row, col: 11 }).move({ row: 0, col: 10 })
  //               .move({ row, col: 7 })
  //
  //   assert.equal(board.getThreats().length, 1)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 7 }, { row, col: 10 }, { row, col: 11 } ],
  //     skipped: [ { row, col: 8 }, { row, col: 9 } ],
  //     expansions: [],
  //     span: 5,
  //   })
  // })
  //
  // // force checking both threats on side to merge
  // //                      01234567890123456789
  // it('moves from scratch: ...3..14.2.........', function () {
  //   let board = new Board()
  //
  //   let row = 7;
  //   board = board.move({ row, col: 6 }).move({ row: 0, col: 0 })
  //               .move({ row, col: 9 }).move({ row: 0, col: 10 })
  //               .move({ row, col: 3 }).move({ row: 0, col: 18 })
  //               .move({ row, col: 7 })
  //
  //   assert.equal(board.getThreats().length, 2)
  // })
  //
  //
  //
  // it("don't join threats of opposite player", function () {
  //   let board = new Board()
  //
  //   let col = 4
  //   board = board.move({ row: 8, col }).move({ row: 9, col })
  //               .move({ row: 7, col }).move({ row: 10, col })
  //   assert.equal(board.getThreats().length, 2)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "0",
  //     played: [ { row: 7, col }, { row: 8, col } ],
  //     skipped: [],
  //     expansions: [ { row: 6, col } ],
  //     span: 2,
  //   })
  //   assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
  //     player: false,
  //     finderIndex: "0",
  //     played: [ { row: 9, col }, { row: 10, col } ],
  //     skipped: [],
  //     expansions: [ { row: 11, col } ],
  //     span: 2,
  //   })
  // })
  //
  // // make sure threats that don't have space aren't recorded
  // it("doesn't find threats that can't expand", function () {
  //   let board = new Board()
  //
  //   board = board.move({ row: 0, col: 1 }).move({ row: 17, col: 16 })
  //               .move({ row: 1, col: 0 }).move({ row: 16, col: 17 })
  //   assert.equal(board.getThreats().length, 0)
  // })
  //
  // it("removes threats that can no longer expand", function () {
  //   let board = new Board()
  //
  //   let col = 4
  //   board = board.move({ row: 5, col }).move({ row: 7, col })
  //               .move({ row: 6, col }).move({ row: 12, col: 0 })
  //               .move({ row: 4, col })
  //   assert.equal(board.getThreats().length, 1)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "0",
  //     played: [ { row: 4, col }, { row: 5, col }, { row: 6, col } ],
  //     skipped: [],
  //     expansions: [ { row: 3, col } ],
  //     span: 3,
  //   })
  //
  //   // block the true player from expanding
  //   board = board.move({ row: 2, col })
  //   assert.equal(board.getThreats().length, 1)
  //   assert.equal(board.getThreats()[0], undefined)
  // })
  //
  // it("splits threats that are broken in two", function () {
  //   let board = new Board()
  //
  //   let row = 4
  //   board = board.move({ row, col: 3 }).move({ col: 0, row: 0 })
  //               .move({ row, col: 4 }).move({ col: 0, row: 10 })
  //               .move({ row, col: 6 }).move({ col: 0, row: 18 })
  //               .move({ row, col: 7 })
  //
  //   assert.equal(board.getThreats().length, 1)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [
  //       { row, col: 3 },
  //       { row, col: 4 },
  //       { row, col: 6 },
  //       { row, col: 7 },
  //     ],
  //     skipped: [ { row, col: 5 } ],
  //     expansions: [],
  //     span: 5,
  //   })
  //
  //   // bisect the threat (false to move)
  //   board = board.move({ row, col: 5 })
  //   assert.equal(board.getThreats().length, 3)
  //   assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 3 }, { row, col: 4 }, ],
  //     skipped: [],
  //     expansions: [ { row, col: 2 } ],
  //     span: 2,
  //   })
  //   assert.deepEqual(_.omit(board.getThreats()[2], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 6 }, { row, col: 7 }, ],
  //     skipped: [],
  //     expansions: [ { row, col: 8 } ],
  //     span: 2,
  //   })
  // })
  //
  // it("splits threats that are broken in two part 2", function () {
  //   let board = new Board()
  //
  //   let col = 4
  //   board = board.move({ row: 3, col }).move({ row: 0, col: 0 })
  //               .move({ row: 4, col }).move({ row: 0, col: 10 })
  //               .move({ row: 6, col }).move({ row: 0, col: 18 })
  //               .move({ row: 7, col }).move({ row: 18, col: 0 })
  //               .move({ row: 9, col })
  //
  //   assert.equal(board.getThreats().length, 2)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "0",
  //     played: [
  //       { row: 3, col },
  //       { row: 4, col },
  //       { row: 6, col },
  //       { row: 7, col },
  //     ],
  //     skipped: [ { row: 5, col } ],
  //     expansions: [],
  //     span: 5,
  //   })
  //   assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
  //     player: true,
  //     finderIndex: "0",
  //     played: [ { row: 6, col }, { row: 7, col }, { row: 9, col } ],
  //     skipped: [ { row: 8, col } ],
  //     expansions: [ { row: 5, col }, { row: 10, col } ],
  //     span: 4,
  //   })
  //
  //   // bisect the threat (false to move)
  //   board = board.move({ row: 5, col })
  //   assert.equal(board.getThreats().length, 3)
  //   assert.deepEqual(_.omit(board.getThreats()[2], "score"), {
  //     player: true,
  //     finderIndex: "0",
  //     played: [ { row: 3, col }, { row: 4, col }, ],
  //     skipped: [],
  //     expansions: [ { row: 2, col } ],
  //     span: 2,
  //   })
  //   assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
  //     player: true,
  //     finderIndex: "0",
  //     played: [ { row: 6, col }, { row: 7, col }, { row: 9, col } ],
  //     skipped: [ { row: 8, col } ],
  //     expansions: [ { row: 10, col } ],
  //     span: 4,
  //   })
  // })
  //
  // it("inPlayCells works properly", function () {
  //   let board = new Board()
  //
  //   let row = 7;
  //   board = board.move({ row: 7, col: 7 })
  //   assert.deepEqual(board.getInPlayCells(), {
  //     6: { 6: true, 7: true, 8: true },
  //     7: { 6: true, 8: true },
  //     8: { 6: true, 7: true, 8: true },
  //   })
  //
  //   board = board.move({ row: 6, col: 6 })
  //   assert.deepEqual(board.getInPlayCells(), {
  //     5: { 5: true, 6: true, 7: true },
  //     6: { 5: true, 7: true, 8: true },
  //     7: { 5: true, 6: true, 8: true },
  //     8: { 6: true, 7: true, 8: true },
  //   })
  //
  //   board = board.move({ row: 0, col: 0 })
  //   let betweenBoard = board
  //   let betweenBoardSolution = {
  //     0: { 1: true },
  //     1: { 0: true, 1: true },
  //     5: { 5: true, 6: true, 7: true },
  //     6: { 5: true, 7: true, 8: true },
  //     7: { 5: true, 6: true, 8: true },
  //     8: { 6: true, 7: true, 8: true },
  //   }
  //   assert.deepEqual(board.getInPlayCells(), betweenBoardSolution)
  //
  //   board = board.move({ row: 18, col: 18 })
  //   assert.deepEqual(board.getInPlayCells(), {
  //     0: { 1: true },
  //     1: { 0: true, 1: true },
  //     5: { 5: true, 6: true, 7: true },
  //     6: { 5: true, 7: true, 8: true },
  //     7: { 5: true, 6: true, 8: true },
  //     8: { 6: true, 7: true, 8: true },
  //     17: { 17: true, 18: true },
  //     18: { 17: true },
  //   })
  //
  //   // make sure it didn't change the last one
  //   assert.deepEqual(betweenBoard.getInPlayCells(), betweenBoardSolution)
  // })
  //
  // it("easy win works", function () {
  //   let boardValues = JSON.parse(JSON.stringify(blankValues))
  //   boardValues[0][0] = "white"
  //   boardValues[0][5] = "white"
  //   boardValues[0][10] = "white"
  //   boardValues[4][3] = "white"
  //   boardValues[4][4] = "black"
  //   boardValues[4][5] = "black"
  //   boardValues[4][6] = "black"
  //   boardValues[4][7] = "black"
  //
  //   board = createEngineState("white", "black", boardValues)
  //   assert.deepEqual(board.getBestMove(), { row: 4, col: 8 })
  //
  //   board = createEngineState("black", "white", boardValues)
  //   assert.deepEqual(board.getInPlayCells(), {
  //     0: {
  //       1: true,
  //       4: true, 6: true,
  //       9: true, 11: true,
  //     },
  //     1: {
  //       0: true, 1: true,
  //       4: true, 5: true, 6: true,
  //       9: true, 10: true, 11: true,
  //     },
  //     3: { 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true },
  //     4: { 2: true, 8: true },
  //     5: { 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true },
  //   })
  //   assert.deepEqual(board.getBestMove(), { row: 4, col: 8 })
  // })
  //
  // it("doesn't change board to check for best move", function () {
  //   this.timeout(5000)
  //
  //   let boardValues = [
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,"AI",null,null,null,null,null,"AI",null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,"ME",null,null,null,"ME",null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"ME",null,"ME",null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,"ME",null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"ME","AI","ME",null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,"AI",null,"AI",null,"AI",null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"AI","AI",null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //   ]
  //
  //   let board = createEngineState("ME", "AI", boardValues)
  //   let control = createEngineState("ME", "AI", boardValues)
  //
  //   // this line could corrupt the board so check afterwards if it has
  //   assert.isDefined(board.getBestMove())
  //
  //   assert.deepEqual(board.getValues(), control.getValues())
  // })
  //
  // it("before and after string board should match", function () {
  //   let boardValues = [
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,"ME",null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"ME","AI",null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"AI",null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //   ]
  //
  //   // AI goes first and is maximizing player
  //   let state = createEngineState("AI", "ME", boardValues)
  //   assert.deepEqual(state.getStringBoard(), boardValues)
  // })
  //
  // it("shouldn't crash if no way of winning", function () {
  //   let boardValues = [
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,"ME",null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"ME","AI",null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,"ME","AI",null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,"ME","AI",null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //   ]
  //
  //   let state = createEngineState("AI", "ME", boardValues)
  //   let bestMove = state.getBestMove()
  //   assert.deepEqual(bestMove, { row: 8, col: 9 })
  // })
  //
  // it("should win if possible", function () {
  //   let boardValues = [
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,"ME",null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,"ME","AI",null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,"ME","AI",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,"ME","AI",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,"AI",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //   ]
  //
  //   let state = createEngineState("AI", "ME", boardValues)
  //   let bestMove = state.getBestMove()
  //   assert.deepEqual(bestMove, { row: 1, col: 5 })
  // })
  //
  // it("a normal game", function () {
  //   this.timeout(4000)
  //
  //   let boardValues = JSON.parse(JSON.stringify(blankValues))
  //   boardValues[8][9] = "white"
  //   boardValues[9][8] = "black"
  //   boardValues[9][9] = "white"
  //   boardValues[10][9] = "black"
  //   boardValues[10][8] = "white"
  //   boardValues[11][10] = "black"
  //
  //   board = createEngineState("white", "black", boardValues)
  //   assert.equal(board.getThreats().length, 3)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: '0',
  //     played: [ { row: 8, col: 9 }, { row: 9, col: 9 } ],
  //     skipped: [],
  //     expansions: [ { row: 7, col: 9 } ],
  //     span: 2,
  //   })
  //   assert.deepEqual(_.omit(board.getThreats()[1], "score"), {
  //     player: true,
  //     finderIndex: '3',
  //     played: [ { row: 10, col: 8 }, { row: 9, col: 9 } ],
  //     skipped: [],
  //     expansions: [ { row: 11, col: 7 }, { row: 8, col: 10 } ],
  //     span: 2,
  //   })
  //   assert.deepEqual(_.omit(board.getThreats()[2], "score"), {
  //     player: false,
  //     finderIndex: '2',
  //     played: [ { row: 9, col: 8 }, { row: 10, col: 9 }, { row: 11, col: 10 } ],
  //     skipped: [],
  //     expansions: [ { row: 8, col: 7 }, { row: 12, col: 11 } ],
  //     span: 3,
  //   })
  //
  //   // continue the game for a single move...
  //   board = board.move({ row: 12, col: 11 }) // white
  //   assert.deepEqual(_.omit(board.getThreats()[2], "score"), {
  //     player: false,
  //     finderIndex: '2',
  //     played: [
  //       { row: 9, col: 8 },
  //       { row: 10, col: 9 },
  //       { row: 11, col: 10 },
  //     ],
  //     skipped: [],
  //     expansions: [ { row: 8, col: 7 } ],
  //     span: 3,
  //   })
  //
  //   boardValues[12][11] = "white"
  //   boardValues[10][10] = "black"
  //   boardValues[11][7] = "white"
  //
  //   board = createEngineState("black", "white", boardValues)
  //   assert.deepEqual(board.getBestMove(), { row: 7, col: 9 })
  //
  //   boardValues[8][10] = "black"
  //   boardValues[8][7] = "white"
  //   board = createEngineState("black", "white", boardValues)
  //   assert.deepEqual(board.getBestMove(), { row: 9, col: 10 })
  //
  //   boardValues[9][10] = "black"
  //   boardValues[12][6] = "white"
  //
  //   board = createEngineState("black", "white", boardValues)
  //   assert.equal(board.getWinningThreat().played, undefined)
  //
  //   // NOTE: black can win with { row: 7, col: 10 } or { row: 12, col: 10 }
  //   // play winning move and make sure it figures out we've won
  //   boardValues[7][10] = "black"
  //   board = createEngineState("white", "black", boardValues)
  //   assert.deepEqual(board.getWinningThreat().played, [
  //     { row: 7, col: 10 },
  //     { row: 8, col: 10 },
  //     { row: 9, col: 10 },
  //     { row: 10, col: 10 },
  //     { row: 11, col: 10 },
  //   ])
  // })
  //
  // it("simple capturing pieces", function () {
  //   let row = 8
  //
  //   let board = new Board()
  //       .move({ row, col: 8 }).move({ row, col: 9 })
  //       .move({ row, col: 7 })
  //
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played:[
  //       { row, col: 7 },
  //       { row, col: 8 }
  //     ],
  //     skipped:[],
  //     expansions:[ { row, col: 6 } ],
  //     span: 2,
  //   })
  //
  //   board = board.move({ row, col: 6 })
  //
  //   assert.equal(board.values[8][8], null)
  //   assert.equal(board.values[8][7], null)
  //   assert.equal(board.threats[0], undefined)
  //   assert.equal(board.threats.length, 2)
  //
  //   assert.deepEqual(_.omit(board.threats[1], "score"), {
  //     player: false,
  //     finderIndex: "1",
  //     played:[ { row, col: 6 }, { row, col: 9 } ],
  //     skipped:[ { row, col: 7 }, { row, col: 8 } ],
  //     expansions:[ { row, col: 5 }, { row, col: 10 } ],
  //     span: 4,
  //   })
  //
  //   assert.deepEqual(board.cellThreats.toJS()[1][8], [
  //     {},{},{},{},{},{},
  //     {"1":false}, {"1":false}, {"1":false}, {"1":false},
  //     {},{},{},{},{},{},{},{},{}
  //   ])
  // })
  //
  // it("more difficult capturing pieces", function () {
  //   let row = 8
  //
  //   let board = new Board()
  //       .move({ row, col: 8 }).move({ row: 7, col: 7 })
  //       .move({ row, col: 7 }).move({ row: 7, col: 8 })
  //       .move({ row: 0, col: 0 }).move({ row: 9, col: 7 })
  //       .move({ row: 8, col: 0 }).move({ row: 9, col: 8 })
  //       .move({ row: 0, col: 8 }).move({ row, col: 9 })
  //       .move({ row: 18, col: 0 })
  //   // next move will be by black ...
  //   //   0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8
  //   // 0 w . . . . . . . w . . . . . . . . . .
  //   // 1 . . . . . . . . . . . . . . . . . . .
  //   // 2 . . . . . . . . . . . . . . . . . . .
  //   // 3 . . . . . . . . . . . . . . . . . . .
  //   // 4 . . . . . . . . . . . . . . . . . . .
  //   // 5 . . . . . . . . . . . . . . . . . . .
  //   // 6 . . . . . . . . . . . . . . . . . . .
  //   // 7 . . . . . . . b b . . . . . . . . . .
  //   // 8 w . . . . . . w w b . . . . . . . . .
  //   // 9 . . . . . . . b b . . . . . . . . . .
  //   // 0 . . . . . . . . . . . . . . . . . . .
  //   // 1 . . . . . . . . . . . . . . . . . . .
  //   // 2 . . . . . . . . . . . . . . . . . . .
  //   // 3 . . . . . . . . . . . . . . . . . . .
  //   // 4 . . . . . . . . . . . . . . . . . . .
  //   // 5 . . . . . . . . . . . . . . . . . . .
  //   // 6 . . . . . . . . . . . . . . . . . . .
  //   // 7 . . . . . . . . . . . . . . . . . . .
  //   // 8 w . . . . . . . . . . . . . . . . . .
  //
  //   assert.equal(board.threats.length, 5)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played:[ { row, col: 7 }, { row, col: 8 } ],
  //     skipped:[],
  //     expansions:[ { row, col: 6 } ],
  //     span: 2,
  //   })
  //
  //   // move to capture the pieces
  //   board = board.move({ row, col: 6 })
  //   // next move will be by white ...
  //   //   0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8
  //   // 0 w . . . . . . . w . . . . . . . . . .
  //   // 1 . . . . . . . . . . . . . . . . . . .
  //   // 2 . . . . . . . . . . . . . . . . . . .
  //   // 3 . . . . . . . . . . . . . . . . . . .
  //   // 4 . . . . . . . . . . . . . . . . . . .
  //   // 5 . . . . . . . . . . . . . . . . . . .
  //   // 6 . . . . . . . . . . . . . . . . . . .
  //   // 7 . . . . . . . b b . . . . . . . . . .
  //   // 8 w . . . . . b . . b . . . . . . . . .
  //   // 9 . . . . . . . b b . . . . . . . . . .
  //   // 0 . . . . . . . . . . . . . . . . . . .
  //   // 1 . . . . . . . . . . . . . . . . . . .
  //   // 2 . . . . . . . . . . . . . . . . . . .
  //   // 3 . . . . . . . . . . . . . . . . . . .
  //   // 4 . . . . . . . . . . . . . . . . . . .
  //   // 5 . . . . . . . . . . . . . . . . . . .
  //   // 6 . . . . . . . . . . . . . . . . . . .
  //   // 7 . . . . . . . . . . . . . . . . . . .
  //   // 8 w . . . . . . . . . . . . . . . . . .
  //
  //   assert.equal(board.values[8][8], null)
  //   assert.equal(board.values[8][7], null)
  //
  //   assert.equal(board.threats.length, 10)
  //   assert.equal(board.threats[0], undefined)
  //   assert.deepEqual(_.omit(board.threats[1], "score"), {
  //     player: false, finderIndex: "1", span: 2,
  //     played: [ { row: 7, col: 7 }, { row: 7, col: 8 } ],
  //     skipped: [],
  //     expansions: [ { row: 7, col: 6 }, { row: 7, col: 9 } ]
  //   })
  //   assert.deepEqual(_.omit(board.threats[2], "score"), {
  //     player: false, finderIndex: "1", span: 2,
  //     played: [ { row: 9, col: 7 }, { row: 9, col: 8 } ],
  //     skipped: [],
  //     expansions: [ { row: 9, col: 6 }, { row:9, col: 9 } ]
  //   })
  //   assert.deepEqual(_.omit(board.threats[3], "score"), {
  //     player: false, finderIndex: "2", span: 2,
  //     played: [ { row: 7, col: 8 }, { row: 8, col: 9 } ],
  //     skipped: [],
  //     expansions: [ { row: 6, col: 7 }, { row: 9, col: 10 } ]
  //   })
  //   assert.deepEqual(_.omit(board.threats[4], "score"), {
  //     player: false, finderIndex: "3", span: 2,
  //     played: [ { row: 9, col: 8 }, { row: 8, col: 9 } ],
  //     skipped: [],
  //     expansions: [ { row: 10, col: 7 }, { row: 7, col: 10 } ]
  //   })
  //   assert.deepEqual(_.omit(board.threats[5], "score"), {
  //     player: false, finderIndex: "0", span: 3,
  //     played: [ { row: 7, col: 7 }, { row: 9, col: 7 } ],
  //     skipped: [{ row: 8, col: 7 } ],
  //     expansions: [ { row: 6, col: 7 }, { row: 10, col: 7 } ]
  //   })
  //   assert.deepEqual(_.omit(board.threats[6], "score"), {
  //     player: false, finderIndex: "1", span: 4,
  //     played: [ { row: 8, col: 6 }, { row: 8, col: 9 } ],
  //     skipped: [{ row: 8, col: 7}, { row: 8, col: 8 } ],
  //     expansions: [ { row: 8, col: 5 }, { row: 8, col: 10 } ]
  //   })
  //   assert.deepEqual(_.omit(board.threats[7], "score"), {
  //     player: false, finderIndex: "0", span: 3,
  //     played: [ { row: 7, col: 8 }, { row: 9, col: 8 } ],
  //     skipped: [{ row: 8, col: 8 } ],
  //     expansions: [ { row: 6, col: 8 }, { row: 10, col: 8 } ]
  //   })
  //   assert.deepEqual(_.omit(board.threats[8], "score"), {
  //     player: false, finderIndex: "3", span: 2,
  //     played: [ { row: 8, col: 6 }, { row: 7, col: 7 } ],
  //     skipped: [],
  //     expansions: [ { row: 9, col: 5 }, { row: 6, col: 8 } ]
  //   })
  //   assert.deepEqual(_.omit(board.threats[9], "score"), {
  //     player: false, finderIndex: "2", span: 2,
  //     played: [ { row: 8, col: 6 }, { row: 9, col: 7 } ],
  //     skipped: [],
  //     expansions: [ { row: 7, col: 5 }, { row: 10, col: 8 } ]
  //   })
  // })
  //
  // it("very difficult capturing pieces", function () {
  //   let row = 8
  //
  //   let board = new Board()
  //       .move({ row, col: 8 }).move({ row: 7, col: 7 })
  //       .move({ row, col: 7 }).move({ row: 7, col: 8 })
  //       .move({ row: 0, col: 0 }).move({ row: 9, col: 7 })
  //       .move({ row: 8, col: 0 }).move({ row: 9, col: 8 })
  //       .move({ row: 0, col: 8 }).move({ row, col: 9 })
  //       .move({ row: 18, col: 0 })
  //   // next move will be by black ...
  //   //   0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8
  //   // 0 w . . . . . . . w . . . . . . . . . .
  //   // 1 . . . . . . . . . . . . . . . . . . .
  //   // 2 . . . . . . . . . . . . . . . . . . .
  //   // 3 . . . . . . . . . . . . . . . . . . .
  //   // 4 . . . . . . . . . . . . . . . . . . .
  //   // 5 . . . . . . . . . . . . . . . . . . .
  //   // 6 . . . . . . . . . . . . . . . . . . .
  //   // 7 . . . . . . . b b . . . . . . . . . .
  //   // 8 w . . . . . . w w b . . . . . . . . .
  //   // 9 . . . . . . . b b . . . . . . . . . .
  //   // 0 . . . . . . . . . . . . . . . . . . .
  //   // 1 . . . . . . . . . . . . . . . . . . .
  //   // 2 . . . . . . . . . . . . . . . . . . .
  //   // 3 . . . . . . . . . . . . . . . . . . .
  //   // 4 . . . . . . . . . . . . . . . . . . .
  //   // 5 . . . . . . . . . . . . . . . . . . .
  //   // 6 . . . . . . . . . . . . . . . . . . .
  //   // 7 . . . . . . . . . . . . . . . . . . .
  //   // 8 w . . . . . . . . . . . . . . . . . .
  //
  //   assert.equal(board.threats.length, 5)
  //   assert.deepEqual(_.omit(board.getThreats()[0], "score"), {
  //     player: true,
  //     finderIndex: "1",
  //     played:[ { row, col: 7 }, { row, col: 8 } ],
  //     skipped:[],
  //     expansions:[ { row, col: 6 } ],
  //     span: 2,
  //   })
  // })
  //
  // it("more difficult capturing pieces", function () {
  //   this.timeout(5000)
  //
  //   // next move will be by black ...
  //   let boardValues = [
  //     ["WH",null,null,null,null,null,null,null,"WH",null,null,null,null,null,null,"WH",null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"BL",null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,"BL",null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"BL","BL",null,null,null,null,null,null,null,null,null,null],
  //     ["WH",null,null,null,null,null,null,"WH","WH","BL",null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"BL","BL",null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,"BL",null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"BL",null,null,"BL",null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,"WH",null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,"WH",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     ["WH",null,null,null,null,null,null,"WH",null,null,null,null,null,null,null,null,null,null,null],
  //   ]
  //
  //   // ensure everything is kosher with the threats generated
  //   let state = createEngineState("BL", "WH", boardValues)
  //   assert.equal(state.toString(), "next move will be by BL\n" +
  //     "B = BL\n" +
  //     "W = WH\n" +
  //     "    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8\n" +
  //     " 0: W . . . . . . . W . . . . . . W . . .\n" +
  //     " 1: . . . . . . . . . . . . . . . . . . .\n" +
  //     " 2: . . . . . . . . . . . . . . . . . . .\n" +
  //     " 3: . . . . . . . . . . . . . . . . . . .\n" +
  //     " 4: . . . . . . . B . . . . . . . . . . .\n" +
  //     " 5: . . . . . . . . B . . . . . . . . . .\n" +
  //     " 6: . . . . . . . . . . . . . . . . . . .\n" +
  //     " 7: . . . . . . . B B . . . . . . . . . .\n" +
  //     " 8: W . . . . . . W W B . . . . . . . . .\n" +
  //     " 9: . . . . . . . B B . . . . . . . . . .\n" +
  //     "10: . . . . . . . . B . . . . . . . . . .\n" +
  //     "11: . . . . . . . B . . B . . . . . . . .\n" +
  //     "12: . . . . . . . . . . . . . . . . . . .\n" +
  //     "13: . . . . . . . . . . . . . . . . . . .\n" +
  //     "14: . . . . . . . . . . . . . . . . . . .\n" +
  //     "15: . . . . . . . . . . . . . . . . . . .\n" +
  //     "16: . . . . W . . . . . . . . . . . . . .\n" +
  //     "17: . . W . . . . . . . . . . . . . . . .\n" +
  //     "18: W . . . . . . W . . . . . . . . . . .\n")
  //   let threats = _.map(state.getThreats(), threat => _.omit(threat, "score"));
  //   assert.deepEqual(threats, [
  //     {
  //       player: true,
  //       finderIndex: '2',
  //       played: [ { row: 4, col: 7 }, { row: 5, col: 8 } ],
  //       skipped: [],
  //       expansions: [ { row: 3, col: 6 }, { row: 6, col: 9 } ],
  //       span: 2,
  //     },
  //     {
  //       player: true,
  //       finderIndex: '0',
  //       played: [ { row: 4, col: 7 }, { row: 7, col: 7 } ],
  //       skipped: [ { row: 5, col: 7 }, { row: 6, col: 7 } ],
  //       expansions: [ { row: 3, col: 7 } ],
  //       span: 4,
  //     },
  //     {
  //       player: true,
  //       finderIndex: '0',
  //       played: [ { row: 5, col: 8 }, { row: 7, col: 8 } ],
  //       skipped: [ { row: 6, col: 8 } ],
  //       expansions: [ { row: 4, col: 8 } ],
  //       span: 3,
  //     },
  //     {
  //       player: true,
  //       finderIndex: '1',
  //       played: [ { row: 7, col: 7 }, { row: 7, col: 8 } ],
  //       skipped: [],
  //       expansions: [ { row: 7, col: 6 }, { row: 7, col: 9 } ],
  //       span: 2,
  //     },
  //     {
  //       player: false,
  //       finderIndex: '1',
  //       played: [ { row: 8, col: 7 }, { row: 8, col: 8 } ],
  //       skipped: [],
  //       expansions: [ { row: 8, col: 6 } ],
  //       span: 2,
  //     },
  //     {
  //       player: true,
  //       finderIndex: '2',
  //       played: [ { row: 7, col: 8 }, { row: 8, col: 9 } ],
  //       skipped: [],
  //       expansions: [ { row: 6, col: 7 }, { row: 9, col: 10 } ],
  //       span: 2,
  //     },
  //     {
  //       player: true,
  //       finderIndex: '1',
  //       played: [ { row: 9, col: 7 }, { row: 9, col: 8 } ],
  //       skipped: [],
  //       expansions: [ { row: 9, col: 6 }, { row: 9, col: 9 } ],
  //       span: 2,
  //     },
  //     {
  //       player: true,
  //       finderIndex: '3',
  //       played: [ { row: 9, col: 8 }, { row: 8, col: 9 } ],
  //       skipped: [],
  //       expansions: [ { row: 10, col: 7 }, { row: 7, col: 10 } ],
  //       span: 2,
  //     },
  //     {
  //       player: true,
  //       finderIndex: '0',
  //       played: [ { row: 9, col: 8 }, { row: 10, col: 8 } ],
  //       skipped: [],
  //       expansions: [ { row: 11, col: 8 } ],
  //       span: 2,
  //     },
  //     {
  //       player: true,
  //       finderIndex: '2',
  //       played: [ { row: 9, col: 7 }, { row: 10, col: 8 } ],
  //       skipped: [],
  //       expansions: [ { row: 8, col: 6 }, { row: 11, col: 9 } ],
  //       span: 2,
  //     },
  //     {
  //       player: true,
  //       finderIndex: '0',
  //       played: [ { row: 9, col: 7 }, { row: 11, col: 7 } ],
  //       skipped: [ { row: 10, col: 7 } ],
  //       expansions: [ { row: 12, col: 7 } ],
  //       span: 3,
  //     },
  //     {
  //       player: true,
  //       finderIndex: '3',
  //       played: [ { row: 11, col: 7 }, { row: 10, col: 8 } ],
  //       skipped: [],
  //       expansions: [ { row: 12, col: 6 }, { row: 9, col: 9 } ],
  //       span: 2,
  //     },
  //     {
  //       player: true,
  //       finderIndex: '1',
  //       played: [ { row: 11, col: 7 }, { row: 11, col: 10 } ],
  //       skipped: [ { row: 11, col: 8 }, { row: 11, col: 9 } ],
  //       expansions: [ { row: 11, col: 6 }, { row: 11, col: 11 } ],
  //       span: 4,
  //     },
  //     {
  //       player: true,
  //       finderIndex: '2',
  //       played: [ { row: 9, col: 8 }, { row: 11, col: 10 } ],
  //       skipped: [ { row: 10, col: 9 } ],
  //       expansions: [ { row: 12, col: 11 } ],
  //       span: 3,
  //     },
  //   ])
  //   assert.deepEqual(state.getCellThreats().toJS(), [
  //     [
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{  1: true },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{  1: true },{  2: true },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{  1: true },{  2: true },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{  1: true },{  2: true },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{ 10: true },{  8: true },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{ 10: true },{  8: true },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{ 10: true },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //     ],
  //     [
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{  3: true },{  3: true },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{ 4: false },{ 4: false },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{  6: true },{  6: true },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{ 12: true },{ 12: true },{ 12: true },{ 12: true },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //     ],
  //     [
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{  0: true },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{  0: true },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{  5: true },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{  5: true },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{  9: true },{ 13: true },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{  9: true },{ 13: true },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{ 13: true },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //     ],
  //     [
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{  7: true },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{  7: true },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{ 11: true },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{ 11: true },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //       [ {},{},{},{},{},{},{},{          },{          },{          },{          },{},{},{},{},{},{},{},{} ],
  //     ],
  //   ])
  //   let t = true
  //   assert.deepEqual(state.getInPlayCells(), {
  //      0: { 1:t,                               7:t,      9:t,           14:t,       16:t  },
  //      1: { 0:t, 1:t,                          7:t, 8:t, 9:t,           14:t, 15:t, 16:t  },
  //      3: {                               6:t, 7:t, 8:t  },
  //      4: {                               6:t,      8:t, 9:t  },
  //      5: {                               6:t, 7:t, 9:t  },
  //      6: {                               6:t, 7:t, 8:t, 9:t  },
  //      7: { 0:t, 1:t,                     6:t,           9:t, 10:t  },
  //      8: {      1:t,                     6:t,                10:t  },
  //      9: { 0:t, 1:t,                     6:t,           9:t, 10:t  },
  //     10: {                               6:t, 7:t,      9:t, 10:t, 11:t  },
  //     11: {                               6:t,      8:t, 9:t,       11:t  },
  //     12: {                               6:t, 7:t, 8:t, 9:t, 10:t, 11:t  },
  //     15: {                3:t, 4:t, 5:t  },
  //     16: {      1:t, 2:t, 3:t,      5:t  },
  //     17: { 0:t, 1:t,      3:t, 4:t, 5:t, 6:t, 7:t, 8:t  },
  //     18: {      1:t, 2:t, 3:t,           6:t,      8:t  },
  //   })
  //
  //   // TODO: time this and make sure it's less than 500 ms
  //   let bestMove = state.getBestMove()
  //   console.log("state.toString():", state.toString());
  //   assert.deepEqual(bestMove, { row: 7, col: 10 })
  //
  //   let capturedState = state.move({ row: 8, col: 6 })
  //   console.log("\ncapturedState.toString():", capturedState.toString());
  //   assert.equal(capturedState.toString(), "next move will be by WH\n" +
  //     "B = BL\n" +
  //     "W = WH\n" +
  //     "    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8\n" +
  //     " 0: W . . . . . . . W . . . . . . W . . .\n" +
  //     " 1: . . . . . . . . . . . . . . . . . . .\n" +
  //     " 2: . . . . . . . . . . . . . . . . . . .\n" +
  //     " 3: . . . . . . . . . . . . . . . . . . .\n" +
  //     " 4: . . . . . . . B . . . . . . . . . . .\n" +
  //     " 5: . . . . . . . . B . . . . . . . . . .\n" +
  //     " 6: . . . . . . . . . . . . . . . . . . .\n" +
  //     " 7: . . . . . . . B B . . . . . . . . . .\n" +
  //     " 8: W . . . . . B . . B . . . . . . . . .\n" +
  //     " 9: . . . . . . . B B . . . . . . . . . .\n" +
  //     "10: . . . . . . . . B . . . . . . . . . .\n" +
  //     "11: . . . . . . . B . . B . . . . . . . .\n" +
  //     "12: . . . . . . . . . . . . . . . . . . .\n" +
  //     "13: . . . . . . . . . . . . . . . . . . .\n" +
  //     "14: . . . . . . . . . . . . . . . . . . .\n" +
  //     "15: . . . . . . . . . . . . . . . . . . .\n" +
  //     "16: . . . . W . . . . . . . . . . . . . .\n" +
  //     "17: . . W . . . . . . . . . . . . . . . .\n" +
  //     "18: W . . . . . . W . . . . . . . . . . .\n")
  //   let capturedThreats =
  //       _.map(capturedState.getThreats(), threat => _.omit(threat, "score"));
  //   assert.deepEqual(capturedThreats[1], {
  //     player: true,
  //     finderIndex: '0',
  //     played: [ { row: 4, col: 7 }, { row: 7, col: 7 } ],
  //     skipped: [ { row: 5, col: 7 }, { row: 6, col: 7 } ],
  //     expansions: [ { row: 3, col: 7 }, { row: 8, col: 7 } ],
  //     span: 4
  //   })
  //   console.log("capturedThreats[2]:", capturedThreats[2]);
  //   assert.deepEqual(capturedThreats[2], {
  //     player: true,
  //     finderIndex: '0',
  //     played: [ { row: 5, col: 8 }, { row: 7, col: 8 }, { row: 9, col: 8 } ],
  //     skipped: [ { row: 6, col: 8 }, { row: 8, col: 8 } ],
  //     expansions: [],
  //     span: 5
  //   })
  //   assert.deepEqual(capturedThreats[8], {
  //     player: true,
  //     finderIndex: '0',
  //     played: [ { row: 7, col: 8 }, { row: 9, col: 8 }, { row: 10, col: 8 } ],
  //     skipped: [ { row: 8, col: 8 } ],
  //     expansions: [ { row: 6, col: 8 }, { row: 11, col: 8 } ],
  //     span: 4
  //   })
  //   assert.deepEqual(capturedThreats[10], {
  //     player: true,
  //     finderIndex: '0',
  //     played: [ { row: 7, col: 7 }, { row: 9, col: 7 }, { row: 11, col: 7 } ],
  //     skipped: [ { row: 8, col: 7 }, { row: 10, col: 7 } ],
  //     expansions: [],
  //     span: 5
  //   })
  //
  //   assert.deepEqual(capturedThreats, [
  //     {
  //       player: true,
  //       finderIndex: '2',
  //       played: [ { row: 4, col: 7 }, { row: 5, col: 8 } ],
  //       skipped: [],
  //       expansions: [ { row: 3, col: 6 }, { row: 6, col: 9 } ],
  //       span: 2
  //     },
  //     {
  //       player: true,
  //       finderIndex: '0',
  //       played: [ { row: 4, col: 7 }, { row: 7, col: 7 } ],
  //       skipped: [ { row: 5, col: 7 }, { row: 6, col: 7 } ],
  //       expansions: [ { row: 3, col: 7 }, { row: 8, col: 7 } ],
  //       span: 4
  //     },
  //     {
  //       player: true,
  //       finderIndex: '0',
  //       played: [ { row: 5, col: 8 }, { row: 7, col: 8 }, { row: 9, col: 8 } ],
  //       skipped: [ { row: 6, col: 8 }, { row: 8, col: 8 } ],
  //       expansions: [],
  //       span: 5
  //     },
  //     {
  //       player: true,
  //       finderIndex: '1',
  //       played: [ { row: 7, col: 7 }, { row: 7, col: 8 } ],
  //       skipped: [],
  //       expansions: [ { row: 7, col: 6 }, { row: 7, col: 9 } ],
  //       span: 2
  //     },
  //     {}, // don't forget about me!
  //     {
  //       player: true,
  //       finderIndex: '2',
  //       played: [ { row: 7, col: 8 }, { row: 8, col: 9 } ],
  //       skipped: [],
  //       expansions: [ { row: 6, col: 7 }, { row: 9, col: 10 } ],
  //       span: 2
  //     },
  //     {
  //       player: true,
  //       finderIndex: '1',
  //       played: [ { row: 9, col: 7 }, { row: 9, col: 8 } ],
  //       skipped: [],
  //       expansions: [ { row: 9, col: 6 }, { row: 9, col: 9 } ],
  //       span: 2
  //     },
  //     {
  //       player: true,
  //       finderIndex: '3',
  //       played: [ { row: 9, col: 8 }, { row: 8, col: 9 } ],
  //       skipped: [],
  //       expansions: [ { row: 10, col: 7 }, { row: 7, col: 10 } ],
  //       span: 2
  //     },
  //     {
  //       player: true,
  //       finderIndex: '0',
  //       played: [ { row: 7, col: 8 }, { row: 9, col: 8 }, { row: 10, col: 8 } ],
  //       skipped: [ { row: 8, col: 8 } ],
  //       expansions: [ { row: 6, col: 8 }, { row: 11, col: 8 } ],
  //       span: 4
  //     },
  //     {
  //       player: true,
  //       finderIndex: '2',
  //       played: [ { row: 8, col: 6 }, { row: 9, col: 7 }, { row: 10, col: 8 } ],
  //       skipped: [],
  //       expansions: [ { row: 7, col: 5 }, { row: 11, col: 9 } ],
  //       span: 3
  //     },
  //     {
  //       player: true,
  //       finderIndex: '0',
  //       played: [ { row: 7, col: 7 }, { row: 9, col: 7 }, { row: 11, col: 7 } ],
  //       skipped: [ { row: 8, col: 7 }, { row: 10, col: 7 } ],
  //       expansions: [],
  //       span: 5
  //     },
  //     {
  //       player: true,
  //       finderIndex: '3',
  //       played: [ { row: 11, col: 7 }, { row: 10, col: 8 } ],
  //       skipped: [],
  //       expansions: [ { row: 12, col: 6 }, { row: 9, col: 9 } ],
  //       span: 2
  //     },
  //     {
  //       player: true,
  //       finderIndex: '1',
  //       played: [ { row: 11, col: 7 }, { row: 11, col: 10 } ],
  //       skipped: [ { row: 11, col: 8 }, { row: 11, col: 9 } ],
  //       expansions: [ { row: 11, col: 6 }, { row: 11, col: 11 } ],
  //       span: 4
  //     },
  //     {
  //       player: true,
  //       finderIndex: '2',
  //       played: [ { row: 9, col: 8 }, { row: 11, col: 10 } ],
  //       skipped: [ { row: 10, col: 9 } ],
  //       expansions: [ { row: 8, col: 7 }, { row: 12, col: 11 } ],
  //       span: 3
  //     },
  //     {
  //       player: true,
  //       finderIndex: '1',
  //       played: [ { row: 8, col: 6 }, { row: 8, col: 9 } ],
  //       skipped: [ { row: 8, col: 7 }, { row: 8, col: 8 } ],
  //       expansions: [ { row: 8, col: 5 }, { row: 8, col: 10 } ],
  //       span: 4
  //     },
  //     {
  //       player: true,
  //       finderIndex: '3',
  //       played: [ { row: 8, col: 6 }, { row: 7, col: 7 } ],
  //       skipped: [],
  //       expansions: [ { row: 9, col: 5 }, { row: 6, col: 8 } ],
  //       span: 2
  //     },
  //   ])
  //
  //   // TODO: move to block some of the threats in the middle { row: 8, col: 8 }
  //
  //   // TODO: create game state from board where pieces have been taken off
  //   // the board and make sure all the instance variables match as well
  // });
  //
  // // updateThreatsAround recursion check
  //
  // // remove threats that are no longer a thing/remove that single square from it
  //
  // // figure out why createEngineState was being weird with the order of the two players
})
