import {
  startGame,
  INITIAL_STATE,
} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'START_GAME':
      return startGame(state, action)
  }
  return state;
}
