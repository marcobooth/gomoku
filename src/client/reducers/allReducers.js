import { ADD_MESSAGE, SET_STATE, CONNECTED } from '../actions/allActions'
import { Map } from 'immutable'

export function mergeState(state, newState) {
  return state.merge(newState)
}

export default (state = Map() , action) => {
  switch(action.type){
    case SET_STATE:
      return mergeState(state, action.state)
    case CONNECTED:
      return state.set('connected', true)
    default:
      return state
  }
};
