export const SET_STATE = 'SET_STATE'

export const setState = (state) => {
  return {
    type: SET_STATE,
    state
  }
}

export const PLACE_PIECE = 'PLACE_PIECE'

export const placePiece = (mainKey, secondKey) => {
  return {
    meta: { remote: true },
    type: PLACE_PIECE,
    mainKey,
    secondKey
  }
}
