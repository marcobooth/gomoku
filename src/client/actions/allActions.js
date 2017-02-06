export const ADD_MESSAGE = 'ADD_MESSAGE'

export const addMessage = (roomName, username, message) => {
  return {
    meta: { remote: true },
    type: ADD_MESSAGE,
    roomName,
    username,
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

export const joinGame = (roomName, username) => {
  return {
    meta: { remote: true },
    type: JOIN_GAME,
    roomName,
    username,
  }
}

export const START_GAME = 'START_GAME'

export const startGame = (roomName, username) => {
  return {
    meta: { remote: true },
    type: START_GAME,
    roomName,
    username,
  }
}

// export const END_GAME = 'END_GAME'
//
// export const endGame = () => {
//   return {
//     meta: { remote: true },
//     roomName: '42',
//     type: END_GAME,
//   }
// }

export const MOVE_PIECE = 'MOVE_PIECE'

export const movePiece = (roomName, username, direction) => {
  return {
    meta: { remote: true },
    type: MOVE_PIECE,
    roomName,
    username,
    direction
  }
}

export const ROTATE_PIECE = 'ROTATE_PIECE'

export const rotatePiece = (roomName, username, direction) => {
  return {
    meta: { remote: true },
    type: ROTATE_PIECE,
    roomName,
    username,
  }
}

export const PLACE_PIECE = 'PLACE_PIECE'

export const placePiece = (roomName, username) => {
  return {
    meta: { remote: true },
    type: PLACE_PIECE,
    roomName,
    username,
  }
}
