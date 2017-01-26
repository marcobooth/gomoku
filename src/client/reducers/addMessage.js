import { ADD_MESSAGE } from '../actions/addMessage'

// import { Map, List } from "immutable"

const reducer = (state = {} , action) => {
  switch(action.type){
    case ADD_MESSAGE:
      return {
        messages: [...state.messages, action.message],
      }
    default:
      return state
  }
}

export default reducer
