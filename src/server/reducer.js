import {addMessage, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  console.log("state, action:", state, action);
  switch (action.type) {
  case 'ADD_MESSAGE':
    return addMessage(state, action.message);
  // case 'NEXT':
  //   return next(state);
  // case 'VOTE':
  //   return state.update('vote',
  //                       voteState => vote(voteState, action.entry));
  }
  return state;
}
