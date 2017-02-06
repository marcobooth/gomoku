import {
  addMessage,
  addPiece,
  // endGame,
  movePiece,
  rotatePiece,
  placePiece,
  joinGame,
  // createGame,
  INITIAL_STATE,
} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return addMessage(state, action.message)
    case 'MOVE_PIECE':
      return movePiece(state, action.player, action.direction)
    case 'ROTATE_PIECE':
      return rotatePiece(state, action)
    case 'PLACE_PIECE':
      return placePiece(state, action.player)
    case 'JOIN_GAME':
      return joinGame(state, action.roomName, action.username)
    // case 'START_GAME':
    //   return createGame(state, action);
    // case 'END_GAME':
    //   return endGame(state, action);
  }

  return state;
}
