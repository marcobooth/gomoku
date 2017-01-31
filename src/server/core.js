import Immutable from 'immutable';
import {List, Map} from 'immutable';

export function addMessage(state, message) {
  return state.updateIn(['messages'], arr => {
    arr.push(message)
    return arr
  });
}

export function addPiece(state, action) {
  var numberOfPieces = state.getIn(['game', 'pieces']).count();
  if (numberOfPieces <= state.getIn(['clients', action.player, 'currentPieceIndex'])) {
    var randomNumber = Math.floor((Math.random() * 3));
    var listOfPieces = state.get('pieces');
    var randomPiece = listOfPieces.toArray()[randomNumber];
    return state.updateIn(['game', 'pieces'], pieces => {
      return pieces.concat([randomPiece])
    })
  }
  return state;
}

export function movePiece(state, action) {
  switch (action.direction) {
    case 'left':
      return state.updateIn(['clients', action.player, 'currentPiece', 'col'], 0, col => col + 1);
    case 'right':
      return state.updateIn(['clients', action.player, 'currentPiece', 'col'], 0, col => col - 1);
    default:
      return state.updateIn(['clients', action.player, 'currentPiece', 'row'], 0, row => row + 1);
  }
}

export function createGame(state, action) {
  if (state.getIn(['game', 'alreadyStarted']) === false || state.getIn(['game', 'winner']) === true) {
    var newGame = Map ({ "pieces": List(), "masterUsername": action.player, "alreadyStarted": true, "winner": false });
    return state.updateIn(['game'], currentGame => newGame);
  }
  return state;
}

export function endGame(state, action) {
  if (state.getIn(['game', 'alreadyStarted']) === true && state.getIn(['game', 'winner']) === false) {
    return state.updateIn(['game', 'winner'], winnerValue => true);
  }
  return state;
}

export const INITIAL_STATE = Immutable.fromJS({
  "messages": [
    {
      "username": "tfleming",
      "message": "Hello world!",
      "dateCreated": new Date(),
    },
  ],
  "pieces": [
    {
      "type": "long-straight",
      "color": "FFFFFF",
      "size": 4,
    },
    {
      "type": "straight-narrow",
      "color": "blue",
      "size": 3,
    },
    {
      "type": "square",
      "color": "dark red",
      "size": 1,
    },
  ],
  "game": {
    "pieces": [
      {
        "type": "long-straight",
        "color": "FFFFFF",
        "rotation": 0,
        "row": -4,
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
        "row": -4,
        "col": 0,
      },
      "currentPieceIndex": 0,
      "board": [
        [ null, null, "FFFFFF" ],
        [ null, null, "FFFFFF" ],
        [ null, null, "FFFFFF" ],
        [ null, null, "FFFFFF" ],
      ],
      "winnerState": "winner/loser",
    },
  },
});



// export function setEntries(state, entries) {
//   return state.set('entries', List(entries));
// }
//
// export function next(state) {
//   const entries = state.get('entries').concat(getWinners(state.get('vote')));
//   if (entries.size === 1) {
//     return state.remove('vote')
//                 .remove('entries')
//                 .set('winner', entries.first());
//   }
//   else {
//     return state.merge({
//       vote: Map({pair: entries.take(2)}),
//       entries: entries.skip(2)
//     });
//   }
// }
//
// export function vote(voteState, entry) {
//   return voteState.updateIn(
//     ['tally', entry],
//     0,
//     tally => tally + 1
//   );
// }
//
// function getWinners(vote) {
//   if (!vote) return [];
//   const [a, b] = vote.get('pair');
//   const aVotes = vote.getIn(['tally', a], 0);
//   const bVotes = vote.getIn(['tally', b], 0);
//   if      (aVotes > bVotes)  return [a];
//   else if (aVotes < bVotes)  return [b];
//   else                       return [a, b];
// }
