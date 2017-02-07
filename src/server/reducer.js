import {
  addMessage,
  addPiece,
  // endGame,
  movePiece,
  rotatePiece,
  placePiece,
  joinGame,
  leaveGame,
  // createGame,
  INITIAL_STATE,
} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  console.log("state:", state);;
  console.log("action.type:", action.type);
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
