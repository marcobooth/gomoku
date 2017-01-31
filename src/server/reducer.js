import {addMessage, addPiece, endGame, movePiece, startGame, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  // console.log("state, action:", state, action);
  // console.log(state);
  switch (action.type) {
  case 'ADD_MESSAGE':
    return addMessage(state, action.message);
  case 'MOVE_PIECE':
    return movePiece(state, action);
  case 'START_GAME':
    return startGame(state, action);
  case 'END_GAME':
    return endGame(state, action);
  // case 'VOTE':
  //   return state.update('vote',
  //                       voteState => vote(voteState, action.entry));
  }
  return state;
}
