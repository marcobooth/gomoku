// import { expect } from 'chai'
// import Immutable from 'immutable'
// import { Map, List } from 'immutable'
// import { verticalWinningState, horizontalWinningState, rightDiagonalWinningState, leftDiagonalWinningState } from '../src/server/library'
//
//
// describe('winning scenarios: ', () => {
//   it('left to right', () => {
//     board = [
//       [ "red", "grey", "grey", "grey", "grey" ],
//       [ "grey", "grey", "grey", "grey", "grey" ],
//       [ "grey", "grey", "grey", "grey", "grey" ],
//       [ "grey", "grey", "grey", "grey", "grey" ],
//       [ "grey", "grey", "grey", "grey", "grey" ],
//       [ "grey", "grey", "grey", "grey", "grey" ],
//       [ "grey", "grey", "grey", "grey", "grey" ],
//     ]
//     player = 1
//     for (var i = 0; i < board.length; i++) {
//       for(var j = 0; j < board[i].length; j++) {
//         if (verticalWinningState(board, currentPlayer, [i, j])      ||
//             horizontalWinningState(board, currentPlayer, [i, j])    ||
//             rightDiagonalWinningState(board, currentPlayer, [i, j]) ||
//             leftDiagonalWinningState(board, currentPlayer, [i, j])) {
//               console.log("winner");
//             }
//       }
//     }
//     verticalWinningState(board, player, point)
//     state = joinGame(state, '1234', '42', 'tfleming')
//     state = startGame(state, '42')
//
//     state = state.updateIn(['games', '42', 'clients', 'tfleming', 'board', 0], row => { return ["colour", "colour", "colour", "colour", "colour", "colour", "colour", "colour", "colour", "colour"] })
//     state = checkForFullLine(state, '42', 'tfleming')
//     expect(state.getIn(['games', '42', 'clients', 'tfleming', 'board', 0])).to.equal(List([null, null, null, null, null, null, null, null, null, null]))
//   })
// })
//
//
// describe('non-winning scenarios: ', () => {
//   it('single line', () => {
//     let state = Map({})
//     state = joinGame(state, '1234', '42', 'tfleming')
//     state = startGame(state, '42')
//     state = state.updateIn(['games', '42', 'clients', 'tfleming', 'board', 0], row => { return ["colour", "colour", "colour", "colour", "colour", "colour", "colour", "colour", "colour", "colour"] })
//     state = checkForFullLine(state, '42', 'tfleming')
//     expect(state.getIn(['games', '42', 'clients', 'tfleming', 'board', 0])).to.equal(List([null, null, null, null, null, null, null, null, null, null]))
//   })
// })
