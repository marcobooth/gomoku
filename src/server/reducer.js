import {addMessage, addPiece, endGame, movePiece, createGame, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  // console.log("state, action:", state, action);
  switch (action.type) {
  case 'ADD_MESSAGE':
    return addMessage(state, action.message);
  case 'MOVE_PIECE':
    return movePiece(state, action);
  case 'START_GAME':
    return createGame(state, action);
  case 'END_GAME':
    return endGame(state, action);
  // case 'VOTE':
  //   return state.update('vote',
  //                       voteState => vote(voteState, action.entry));
  }
  return state;
}
