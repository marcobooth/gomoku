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

// export const START_GAME = 'START_GAME',

// start game
// move(right, left, down)
