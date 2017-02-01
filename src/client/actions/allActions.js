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

export const JOIN_GAME = 'JOIN_GAME'

export const joinGame = () => {
  return {
    type: JOIN_GAME,
  }
}

export const START_GAME = 'START_GAME'

export const startGame = () => {
  return {
    meta: { remote: true },
    roomName: '42',
    player: 'tfleming',
    type: START_GAME,
  }
}

export const END_GAME = 'END_GAME'

export const endGame = () => {
  return {
    meta: { remote: true },
    roomName: '42',
    type: END_GAME,
  }
}

export const MOVE_PIECE = 'MOVE_PIECE'

export const movePiece = (direction) => {
  return {
    meta: { remote: true },
    type: MOVE_PIECE,
    player: 'tfleming',
    direction
  }
}

export const ROTATE_PIECE = 'ROTATE_PIECE'

export const rotatePiece = (direction) => {
  return {
    meta: { remote: true },
    type: ROTATE_PIECE,
    player: 'tfleming',
  }
}

export const PLACE_PIECE = 'PLACE_PIECE'

export const placePiece = (direction) => {
  return {
    meta: { remote: true },
    type: PLACE_PIECE,
    player: 'tfleming',
  }
}

// start game
// move(right, left, down)
