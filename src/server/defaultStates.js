import Immutable from 'immutable';

export const NEW_GAME = Immutable.fromJS({
  "messages": [],
  "game": {
    "pieces": [],
    "alreadyStarted": false,
    "winner": false,
  },
  "clients": {},
})

export const NEW_CLIENT = Immutable.fromJS({
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
