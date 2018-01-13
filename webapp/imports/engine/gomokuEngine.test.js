import _ from "underscore"
import { chai } from 'meteor/practicalmeteor:chai';
import Immutable from "immutable"

import { createBoardState } from "./gomokuEngine"

Im = Immutable

var { assert } = chai

function jsonifyThreats(threats) {
  return _.map(threats.toJS(), (threat) => {
    if (threat === undefined) return undefined

    return _.omit(threat, "score")
  })
}

var blankValues = [
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
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
]

describe('Gomoku engine', function () {
  // it("extremely simple", function () {
  //   let boardValues = [
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"ME","ME",null,null,null,null,null,null,null,null,null,null],
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
  //   let board = createBoardState("AI", "ME", boardValues)
  //   assert.deepEqual(jsonifyThreats(board.getThreats()), [
  //     {
  //       finderIndex: "1",
  //       player: false,
  //       played: [ { row: 6, col: 7 }, { row: 6, col: 8 } ],
  //       expansions: [ { row: 6, col: 6 }, { row: 6, col: 9 } ],
  //       skipped: [],
  //       span: 2,
  //     },
  //   ])
  // })
  //
  // it("extremely simple 2", function () {
  //   let boardValues = [
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"ME","ME","ME",null,null,null,null,null,null,null,null,null],
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
  //   let board = createBoardState("AI", "ME", boardValues)
  //   assert.deepEqual(jsonifyThreats(board.getThreats()), [
  //     {
  //       finderIndex: "1",
  //       player: false,
  //       played: [ { row: 6, col: 7 }, { row: 6, col: 8 }, { row: 6, col: 9 } ],
  //       expansions: [ { row: 6, col: 6 }, { row: 6, col: 10 } ],
  //       skipped: [],
  //       span: 3,
  //     },
  //   ])
  // })
  //
  // it("splitting threats doesn't leave behind orphan threats", function () {
  //   let boardValues = [
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,"ME","ME",null,"ME","ME","ME",null,null,null,null,null,null],
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
  //   let row = 6
  //   let board = createBoardState("AI", "ME", boardValues)
  //   assert.deepEqual(jsonifyThreats(board.getThreats()), [
  //     {
  //       finderIndex: "1",
  //       player: false,
  //       played: [ { row, col: 7 }, { row, col: 8 }, { row, col: 10 }, { row, col: 11 } ],
  //       expansions: [],
  //       skipped: [ { row, col: 9 } ],
  //       span: 5,
  //     },
  //     {
  //       finderIndex: "1",
  //       player: false,
  //       played: [ { row, col: 8 }, { row, col: 10 }, { row, col: 11 }, { row, col: 12 } ],
  //       expansions: [],
  //       skipped: [ { row, col: 9 } ],
  //       span: 5,
  //     },
  //   ])
  //   assert.deepEqual(board.getCellThreats().toJS()[1][6], [
  //     {},{},{},{},{},{},{},
  //     { 0: false },
  //     { 0: false, 1: false },
  //     { 0: false, 1: false },
  //     { 0: false, 1: false },
  //     { 0: false, 1: false },
  //     {           1: false },
  //     {},{},{},{},{},{},
  //   ])
  //
  //   board = board.move({ row: 6, col: 9 })
  //   assert.deepEqual(jsonifyThreats(board.getThreats()), [
  //     undefined,
  //     undefined,
  //     {
  //       finderIndex: "1",
  //       player: false,
  //       played: [ { row, col: 7 }, { row, col: 8 } ],
  //       expansions: [ { row, col: 6 } ],
  //       skipped: [],
  //       span: 2,
  //     },
  //     {
  //       finderIndex: "1",
  //       player: false,
  //       played: [ { row, col: 10 }, { row, col: 11 }, { row, col: 12 } ],
  //       expansions: [ { row, col: 13 } ],
  //       skipped: [],
  //       span: 3,
  //     },
  //   ])
  // })
  //
  // it("splitting threats works hard", function () {
  //   let boardValues = [
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  //     [null,null,null,null,"ME",null,null,"ME","ME",null,"ME","ME","ME",null,null,null,null,null,null],
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
  //   let row = 6
  //   let board = createBoardState("AI", "ME", boardValues)
  //   assert.deepEqual(jsonifyThreats(board.getThreats()), [
  //     {
  //       finderIndex: "1",
  //       player: false,
  //       played: [ { row, col: 4 }, { row, col: 7 }, { row, col: 8 } ],
  //       expansions: [],
  //       skipped: [ { row, col: 5 }, { row, col: 6 } ],
  //       span: 5,
  //     },
  //     {
  //       finderIndex: "1",
  //       player: false,
  //       played: [ { row, col: 7 }, { row, col: 8 }, { row, col: 10 }, { row, col: 11 } ],
  //       expansions: [],
  //       skipped: [ { row, col: 9 } ],
  //       span: 5,
  //     },
  //     {
  //       finderIndex: "1",
  //       player: false,
  //       played: [ { row, col: 8 }, { row, col: 10 }, { row, col: 11 }, { row, col: 12 } ],
  //       expansions: [],
  //       skipped: [ { row, col: 9 } ],
  //       span: 5,
  //     },
  //   ])
  //
  //   let newBoard = board.move({ row: 6, col: 9 })
  //   assert.deepEqual(jsonifyThreats(newBoard.getThreats()), [
  //     {
  //       finderIndex: "1",
  //       player: false,
  //       played: [ { row, col: 4 }, { row, col: 7 }, { row, col: 8 } ],
  //       expansions: [],
  //       skipped: [ { row, col: 5 }, { row, col: 6 } ],
  //       span: 5,
  //     },
  //     undefined,
  //     undefined,
  //     {
  //       finderIndex: "1",
  //       player: false,
  //       played: [ { row, col: 10 }, { row, col: 11 }, { row, col: 12 } ],
  //       expansions: [ { row, col: 13 } ],
  //       skipped: [],
  //       span: 3,
  //     },
  //   ])
  // })
  //
  // //                      0123456789
  // it('moves from scratch: ..1..43..2.........', function () {
  //   let startBoard = createBoardState("ME", "AI", blankValues)
  //
  //   assert(jsonifyThreats(startBoard.getThreats()).length === 0)
  //
  //   let row = 7
  //   let board = startBoard.move({ row, col: 2 }).move({ row: 0, col: 0 })
  //   assert(jsonifyThreats(startBoard.getThreats()).length === 0)
  //   assert(jsonifyThreats(board.getThreats()).length === 0)
  //
  //   board = board.move({ row, col: 9 }).move({ row: 0, col: 10 })
  //   assert(jsonifyThreats(board.getThreats()).length === 0)
  //
  //   board = board.move({ row, col: 6 }).move({ row: 0, col: 18 })
  //
  //   // check the threats
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 2)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 2 }, { row, col: 6 } ],
  //     expansions: [],
  //     skipped: [ { row, col: 3 }, { row, col: 4 }, { row, col: 5 } ],
  //     span: 5,
  //   })
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[1], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 6 }, { row, col: 9 } ],
  //     expansions: [ { row, col: 5 }, { row, col: 10 } ],
  //     skipped: [ { row, col: 7 }, { row, col: 8 } ],
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
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 2)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 2 }, { row, col: 5 }, { row, col: 6 } ],
  //     expansions: [],
  //     skipped: [ { row, col: 3 }, { row, col: 4 } ],
  //     span: 5,
  //   })
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[1], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 5 }, { row, col: 6 }, { row, col: 9 } ],
  //     expansions: [],
  //     skipped: [ { row, col: 7 }, { row, col: 8 } ],
  //     span: 5,
  //   })
  // })
  //
  // //                      01234567890123456789
  // it('moves from scratch: .......1235...4.....', function () {
  //   let board = createBoardState("ME", "AI", blankValues)
  //
  //   let row = 7;
  //   board = board.move({ row, col: 7 }).move({ row: 0, col: 0 })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 0)
  //
  //   board = board.move({ row, col: 8 }).move({ row: 0, col: 10 })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 1)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 7 }, { row, col: 8 } ],
  //     expansions: [ { row, col: 6 }, { row, col: 9 } ],
  //     skipped: [],
  //     span: 2,
  //   })
  //
  //   board = board.move({ row, col: 9 }).move({ row: 0, col: 18 })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 1)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 7 }, { row, col: 8 }, { row, col: 9 } ],
  //     expansions: [ { row, col: 6 }, { row, col: 10 } ],
  //     skipped: [],
  //     span: 3,
  //   })
  //
  //   board = board.move({ row, col: 14 }).move({ row: 18, col: 0 })
  //               .move({ row, col: 10 })//.move({ row: 18, col: 10 })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 2)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 7 }, { row, col: 8 }, { row, col: 9 }, { row, col: 10 } ],
  //     expansions: [ { row, col: 6 }, { row, col: 11 } ],
  //     skipped: [],
  //     span: 4,
  //   })
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[1], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 10 }, { row, col: 14 } ],
  //     expansions: [],
  //     skipped: [ { row, col: 11 }, { row, col: 12 }, { row, col: 13 } ],
  //     span: 5,
  //   })
  // })
  //
  // //                      01234567890123456789
  // it('moves from scratch: .......1.3.2.........', function () {
  //   let board = createBoardState("ME", "AI", blankValues)
  //
  //   let row = 7;
  //   board = board.move({ row, col: 7 }).move({ row: 0, col: 0 })
  //               .move({ row, col: 11 }).move({ row: 0, col: 10 })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 1)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 7 }, { row, col: 11 } ],
  //     expansions: [],
  //     skipped: [ { row, col: 8 }, { row, col: 9 }, { row, col: 10 } ],
  //     span: 5,
  //   })
  //
  //   board = board.move({ row, col: 9 })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 1)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 7 }, { row, col: 9 }, { row, col: 11 } ],
  //     expansions: [],
  //     skipped: [ { row, col: 8 }, { row, col: 10 } ],
  //     span: 5,
  //   })
  // })
  //
  // //                      01234567890123456789
  // it('moves from scratch: .....12..3..........', function () {
  //   let board = createBoardState("ME", "AI", blankValues)
  //
  //   let row = 7;
  //   board = board.move({ row, col: 5 }).move({ row: 0, col: 0 })
  //               .move({ row, col: 6 }).move({ row: 0, col: 10 })
  //               .move({ row, col: 9 })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 1)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 5 }, { row, col: 6 }, { row, col: 9 } ],
  //     expansions: [],
  //     skipped: [ { row, col: 7 }, { row, col: 8 } ],
  //     span: 5,
  //   })
  // })
  //
  // //                      01234567890123456789
  // it('moves from scratch: .......3..12........', function () {
  //   let board = createBoardState("ME", "AI", blankValues)
  //
  //   let row = 7;
  //   board = board.move({ row, col: 10 }).move({ row: 0, col: 0 })
  //               .move({ row, col: 11 }).move({ row: 0, col: 10 })
  //               .move({ row, col: 7 })
  //
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 1)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 7 }, { row, col: 10 }, { row, col: 11 } ],
  //     expansions: [],
  //     skipped: [ { row, col: 8 }, { row, col: 9 } ],
  //     span: 5,
  //   })
  // })
  //
  // // force checking both threats on side to merge
  // //                      01234567890123456789
  // it('moves from scratch: ...3..14.2.........', function () {
  //   let board = createBoardState("ME", "AI", blankValues)
  //
  //   let row = 7;
  //   board = board.move({ row, col: 6 }).move({ row: 0, col: 0 })
  //               .move({ row, col: 9 }).move({ row: 0, col: 10 })
  //               .move({ row, col: 3 }).move({ row: 0, col: 18 })
  //               .move({ row, col: 7 })
  //
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 2)
  // })
  //
  // it("don't join threats of opposite player", function () {
  //   let board = createBoardState("ME", "AI", blankValues)
  //
  //   let col = 4
  //   board = board.move({ row: 8, col }).move({ row: 9, col })
  //               .move({ row: 7, col }).move({ row: 10, col })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 2)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "0",
  //     played: [ { row: 7, col }, { row: 8, col } ],
  //     expansions: [ { row: 6, col } ],
  //     skipped: [],
  //     span: 2,
  //   })
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[1], {
  //     player: false,
  //     finderIndex: "0",
  //     played: [ { row: 9, col }, { row: 10, col } ],
  //     expansions: [ { row: 11, col } ],
  //     skipped: [],
  //     span: 2,
  //   })
  // })
  //
  // // make sure threats that don't have space aren't recorded
  // it("doesn't find threats that can't expand", function () {
  //   let board = createBoardState("ME", "AI", blankValues)
  //
  //   board = board.move({ row: 0, col: 1 }).move({ row: 18, col: 17 })
  //               .move({ row: 1, col: 0 }).move({ row: 17, col: 18 })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 0)
  // })
  //
  // it("removes threats that can no longer expand", function () {
  //   let board = createBoardState("ME", "AI", blankValues)
  //
  //   let col = 4
  //   board = board.move({ row: 5, col }).move({ row: 7, col })
  //               .move({ row: 6, col }).move({ row: 12, col: 0 })
  //               .move({ row: 4, col })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 1)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "0",
  //     played: [ { row: 4, col }, { row: 5, col }, { row: 6, col } ],
  //     expansions: [ { row: 3, col } ],
  //     skipped: [],
  //     span: 3,
  //   })
  //
  //   // block the true player from expanding
  //   board = board.move({ row: 2, col })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 1)
  //   assert.equal(jsonifyThreats(board.getThreats())[0], undefined)
  // })
  //
  // it("splits threats that are broken in two", function () {
  //   let board = createBoardState("ME", "AI", blankValues)
  //
  //   let row = 4
  //   board = board.move({ row, col: 3 }).move({ col: 0, row: 0 })
  //               .move({ row, col: 4 }).move({ col: 0, row: 10 })
  //               .move({ row, col: 6 }).move({ col: 0, row: 18 })
  //               .move({ row, col: 7 })
  //
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 1)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [
  //       { row, col: 3 },
  //       { row, col: 4 },
  //       { row, col: 6 },
  //       { row, col: 7 },
  //     ],
  //     expansions: [],
  //     skipped: [ { row, col: 5 } ],
  //     span: 5,
  //   })
  //
  //   // bisect the threat (false to move)
  //   board = board.move({ row, col: 5 })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 3)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[1], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 6 }, { row, col: 7 }, ],
  //     expansions: [ { row, col: 8 } ],
  //     skipped: [],
  //     span: 2,
  //   })
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[2], {
  //     player: true,
  //     finderIndex: "1",
  //     played: [ { row, col: 3 }, { row, col: 4 }, ],
  //     expansions: [ { row, col: 2 } ],
  //     skipped: [],
  //     span: 2,
  //   })
  // })
  //
  // it("splits threats that are broken in two part 2", function () {
  //   let board = createBoardState("ME", "AI", blankValues)
  //
  //   let col = 4
  //   board = board.move({ row: 3, col }).move({ row: 0, col: 0 })
  //               .move({ row: 4, col }).move({ row: 0, col: 10 })
  //               .move({ row: 6, col }).move({ row: 0, col: 18 })
  //               .move({ row: 7, col }).move({ row: 18, col: 0 })
  //               .move({ row: 9, col })
  //
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 2)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: "0",
  //     played: [
  //       { row: 3, col },
  //       { row: 4, col },
  //       { row: 6, col },
  //       { row: 7, col },
  //     ],
  //     expansions: [],
  //     skipped: [ { row: 5, col } ],
  //     span: 5,
  //   })
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[1], {
  //     player: true,
  //     finderIndex: "0",
  //     played: [ { row: 6, col }, { row: 7, col }, { row: 9, col } ],
  //     expansions: [ { row: 5, col }, { row: 10, col } ],
  //     skipped: [ { row: 8, col } ],
  //     span: 4,
  //   })
  //
  //   // bisect the threat (false to move)
  //   board = board.move({ row: 5, col })
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 3)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[1], {
  //     player: true,
  //     finderIndex: "0",
  //     played: [ { row: 6, col }, { row: 7, col }, { row: 9, col } ],
  //     expansions: [ { row: 10, col } ],
  //     skipped: [ { row: 8, col } ],
  //     span: 4,
  //   })
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[2], {
  //     player: true,
  //     finderIndex: "0",
  //     played: [ { row: 3, col }, { row: 4, col } ],
  //     expansions: [ { row: 2, col } ],
  //     skipped: [],
  //     span: 2,
  //   })
  // })
  //
  // it("inPlayCells works properly", function () {
  //   let board = createBoardState("ME", "AI", blankValues)
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
  //   board = createBoardState("white", "black", boardValues)
  //   assert.deepEqual(board.getBestMove(), { row: 4, col: 8 })
  //
  //   board = createBoardState("black", "white", boardValues)
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
  //   let board = createBoardState("ME", "AI", boardValues)
  //   let control = createBoardState("ME", "AI", boardValues)
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
  //   let state = createBoardState("AI", "ME", boardValues)
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
  //   let state = createBoardState("AI", "ME", boardValues)
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
  //   let state = createBoardState("AI", "ME", boardValues)
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
  //   board = createBoardState("white", "black", boardValues)
  //   assert.equal(jsonifyThreats(board.getThreats()).length, 3)
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
  //     player: true,
  //     finderIndex: '0',
  //     played: [ { row: 8, col: 9 }, { row: 9, col: 9 } ],
  //     skipped: [],
  //     expansions: [ { row: 7, col: 9 } ],
  //     span: 2,
  //   })
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[1], {
  //     player: true,
  //     finderIndex: '3',
  //     played: [ { row: 10, col: 8 }, { row: 9, col: 9 } ],
  //     skipped: [],
  //     expansions: [ { row: 11, col: 7 }, { row: 8, col: 10 } ],
  //     span: 2,
  //   })
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[2], {
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
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[2], {
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
  //   board = createBoardState("black", "white", boardValues)
  //   assert.deepEqual(board.getBestMove(), { row: 8, col: 10 })
  //
  //   boardValues[8][10] = "black"
  //   boardValues[8][7] = "white"
  //   board = createBoardState("black", "white", boardValues)
  //   assert.deepEqual(board.getBestMove(), { row: 9, col: 10 })
  //
  //   boardValues[9][10] = "black"
  //   boardValues[12][6] = "white"
  //
  //   board = createBoardState("black", "white", boardValues)
  //   assert.equal(board.getWinningThreat().played, undefined)
  //
  //   // NOTE: black can win with { row: 7, col: 10 } or { row: 12, col: 10 }
  //   // play winning move and make sure it figures out we've won
  //   boardValues[7][10] = "black"
  //   board = createBoardState("white", "black", boardValues)
  //   assert.deepEqual(board.getWinningThreat().played, [
  //     { row: 7, col: 10 },
  //     { row: 8, col: 10 },
  //     { row: 9, col: 10 },
  //     { row: 10, col: 10 },
  //     { row: 11, col: 10 },
  //   ])
  // })

  it("simple capturing pieces", function () {
    let row = 8

    let board = createBoardState("X", "O", blankValues)
        .move({ row, col: 8 }).move({ row, col: 9 })
        .move({ row, col: 7 })

    assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
      player: true,
      finderIndex: "1",
      played:[
        { row, col: 7 },
        { row, col: 8 }
      ],
      skipped:[],
      expansions:[ { row, col: 6 } ],
      span: 2,
    })

    board = board.move({ row, col: 6 })

    assert.equal(board.values.toJS()[8][8], null)
    assert.equal(board.values.toJS()[8][7], null)
    assert.equal(jsonifyThreats(board.getThreats())[0], undefined)
    assert.equal(jsonifyThreats(board.getThreats()).length, 2)

    assert.deepEqual(jsonifyThreats(board.getThreats())[1], {
      player: false,
      finderIndex: "1",
      played:[ { row, col: 6 }, { row, col: 9 } ],
      skipped:[ { row, col: 7 }, { row, col: 8 } ],
      expansions:[ { row, col: 5 }, { row, col: 10 } ],
      span: 4,
    })

    assert.deepEqual(board.cellThreats.toJS()[1][8], [
      {},{},{},{},{},{},
      {"1":false}, {"1":false}, {"1":false}, {"1":false},
      {},{},{},{},{},{},{},{},{}
    ])
  })

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
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
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
  //   assert.deepEqual(board.threats[1], {
  //     player: false, finderIndex: "1", span: 2,
  //     played: [ { row: 7, col: 7 }, { row: 7, col: 8 } ],
  //     skipped: [],
  //     expansions: [ { row: 7, col: 6 }, { row: 7, col: 9 } ]
  //   })
  //   assert.deepEqual(board.threats[2], {
  //     player: false, finderIndex: "1", span: 2,
  //     played: [ { row: 9, col: 7 }, { row: 9, col: 8 } ],
  //     skipped: [],
  //     expansions: [ { row: 9, col: 6 }, { row:9, col: 9 } ]
  //   })
  //   assert.deepEqual(board.threats[3], {
  //     player: false, finderIndex: "2", span: 2,
  //     played: [ { row: 7, col: 8 }, { row: 8, col: 9 } ],
  //     skipped: [],
  //     expansions: [ { row: 6, col: 7 }, { row: 9, col: 10 } ]
  //   })
  //   assert.deepEqual(board.threats[4], {
  //     player: false, finderIndex: "3", span: 2,
  //     played: [ { row: 9, col: 8 }, { row: 8, col: 9 } ],
  //     skipped: [],
  //     expansions: [ { row: 10, col: 7 }, { row: 7, col: 10 } ]
  //   })
  //   assert.deepEqual(board.threats[5], {
  //     player: false, finderIndex: "0", span: 3,
  //     played: [ { row: 7, col: 7 }, { row: 9, col: 7 } ],
  //     skipped: [{ row: 8, col: 7 } ],
  //     expansions: [ { row: 6, col: 7 }, { row: 10, col: 7 } ]
  //   })
  //   assert.deepEqual(board.threats[6], {
  //     player: false, finderIndex: "1", span: 4,
  //     played: [ { row: 8, col: 6 }, { row: 8, col: 9 } ],
  //     skipped: [{ row: 8, col: 7}, { row: 8, col: 8 } ],
  //     expansions: [ { row: 8, col: 5 }, { row: 8, col: 10 } ]
  //   })
  //   assert.deepEqual(board.threats[7], {
  //     player: false, finderIndex: "0", span: 3,
  //     played: [ { row: 7, col: 8 }, { row: 9, col: 8 } ],
  //     skipped: [{ row: 8, col: 8 } ],
  //     expansions: [ { row: 6, col: 8 }, { row: 10, col: 8 } ]
  //   })
  //   assert.deepEqual(board.threats[8], {
  //     player: false, finderIndex: "3", span: 2,
  //     played: [ { row: 8, col: 6 }, { row: 7, col: 7 } ],
  //     skipped: [],
  //     expansions: [ { row: 9, col: 5 }, { row: 6, col: 8 } ]
  //   })
  //   assert.deepEqual(board.threats[9], {
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
  //   assert.deepEqual(jsonifyThreats(board.getThreats())[0], {
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
  //   let state = createBoardState("BL", "WH", boardValues)
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
  // // figure out why createBoardState was being weird with the order of the two players

  // check potentialSpan < 5 thing - create threat where it can't grow and make sure it isn't added

  // check moving into a capture

  // check multiple captures in one go
})
