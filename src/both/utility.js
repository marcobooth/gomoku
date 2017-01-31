import pieces from './pieces'
import _ from 'underscore'

// {
//   "type": "long-straight",
//   "color": "FFFFFF",
//   "rotation": 0,
//   "row": -4,
//   "col": 0,
// },

export const putPieceOnBoard = (board, piece) => {
  let pieceInfo = _.findWhere(pieces, { type: piece.type })
  let piecePositions = pieceInfo.positions[piece.rotation]

  _.each(piecePositions, ({ row, col }) => {
    // figure out where to fill in
    let fillRow = piece.row + row
    let fillCol = piece.col + col

    // check if it's outside the board
    if (fillRow < 0 || fillRow >= board.length ||
        fillCol < 0 || fillCol >= board[0].length) {
      return false
    }

    // check if it's already filled
    // (do this after checking if it's outside the board so it doesn't break)
    if (board[newRow][fillCol]) {
      return false
    }

    board[fillRow][fillCol] = piece.color;
  });

  return board;
};
