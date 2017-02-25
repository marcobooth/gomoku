import {
  placePiece,
  INITIAL_STATE,
} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  console.log("hillo");
  switch (action.type) {
    case 'PLACE_PIECE':
      return placePiece(state, action.mainKey, action.secondKey)
  }
  return state;
}
