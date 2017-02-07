import {
  addMessage,
  movePiece,
  rotatePiece,
  placePiece,
  joinGame,
  leaveGame,
  startGame,
  INITIAL_STATE,
} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return addMessage(state, action.message)
    case 'MOVE_PIECE':
      return movePiece(state, action.roomName, action.username, action.direction)
    case 'ROTATE_PIECE':
      return rotatePiece(state, action.roomName, action.username)
    case 'PLACE_PIECE':
      return placePiece(state, action.roomName, action.username)
    case 'JOIN_GAME':
      return joinGame(state, action.socketId, action.roomName, action.username)
    case 'LEAVE_GAME':
      return leaveGame(state, action.socketId)
    case 'START_GAME':
      return startGame(state, action.roomName);
    // case 'END_GAME':
    //   return endGame(state, action);
  }

  return state;
}
