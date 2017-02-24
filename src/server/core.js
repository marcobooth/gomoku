import Immutable from 'immutable';
import { List, Map } from 'immutable';

export function startGame(state) {
  return state.update(['test'], value => { return true })
}


export const INITIAL_STATE = Immutable.fromJS({
  "test": false,
  "board": [
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null ],
  ],
})
