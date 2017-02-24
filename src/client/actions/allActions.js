export const SET_STATE = 'SET_STATE'

export const setState = (state) => {
  return {
    type: SET_STATE,
    state
  }
}

export const START_GAME = 'START_GAME'

export const startGame = () => {
  return {
    meta: { remote: true },
    type: START_GAME
  }
}
