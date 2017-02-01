import Immutable from 'immutable'

export const EXAMPLE_STATE = Immutable.fromJS({
  "messages": [
    {
      "username": "tfleming",
      "message": "Hello world!",
      "dateCreated": new Date(),
    },
  ],
  "game": {
    "pieces": [
      {
        "type": "long-straight",
        "rotation": 0,
        "row": 4,
        "col": 0,
      },
    ],
    "masterUsername": "",
    "alreadyStarted": false,
    "winner": false,
    // "roomName": "42",
  },
  "clients": {
    "tfleming": {
      "currentPiece": {
        "type": "long-straight",
        "rotation": 0,
        "row": 4,
        "col": 0,
      },
      "currentPieceIndex": 0,
      "board": [
        [ 'FFFF', 'FFFF', 'FFFF', 'FFFF', 'FFFF', 'FFFF', 'FFFF', 'FFFF', 'FFFF', 'FFFF' ],
        ["FFF0F" ,"FFF0F" ,"FFF0F" ,"FFF0F" ,"FFF0F" ,"FFF0F" ,"FFF0F" ,"FFF0F" ,"FFF0F" ,"FFF0F"  ],
      ],
      "winnerState": "winner/loser",
    },
  },
});
