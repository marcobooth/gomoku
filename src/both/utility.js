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
  let pieceInfo = _.findWhere(pieces, { type: piece.get("type") })
  let pieceLocations = pieceInfo.positions[piece.get('rotation')]
  for (let {row, col} of pieceLocations) {
    // figure out where to fill in
    let fillRow = piece.get('row') + row
    let fillCol = piece.get('col') + col
    // check if it's outside the board
    if (fillRow < -4 || fillRow >= board.size ||
        fillCol < 0 || fillCol >= board.get(0).size) {
      return false
    }

    // check if it's already filled
    // (do this after checking if it's outside the board so it doesn't break)
    if (board.getIn([fillRow, fillCol])) {
      return false
    }

    board = board.setIn([fillRow, fillCol], piece.get("color"))
  }

  return board
};