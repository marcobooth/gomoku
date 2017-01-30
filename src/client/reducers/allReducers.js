import { ADD_MESSAGE, SET_STATE } from '../actions/allActions'
import { Map } from 'immutable'

export function mergeState(state, newState) {
  return state.merge(newState)
}

export default (state = Map() , action) => {
  switch(action.type){
    case ADD_MESSAGE:
      console.log("ADD_MESSAGE on client");
      return state
      // return Map({
      //   messages: [...state.messages, action.message],
      // }
    case SET_STATE:
      return mergeState(state, action.state)
    default:
      return state
  }
};
