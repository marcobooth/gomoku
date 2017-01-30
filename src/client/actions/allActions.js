export const ADD_MESSAGE = 'ADD_MESSAGE'

export const addMessage = (message) => {
  return {
    meta: { remote: true },
    type: ADD_MESSAGE,
    message
  }
}

export const SET_STATE = 'SET_STATE'

export const setState = (state) => {
  return {
    type: SET_STATE,
    state
  }
}
