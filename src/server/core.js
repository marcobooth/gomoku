import {List, Map} from 'immutable';

export const INITIAL_STATE = Map({
  "messages": [
    {
      "username": "tfleming",
      "message": "Hello world!",
      "dateCreated": new Date(),
    },
  ],
  "pieces": {
    "long-straight": {
      "color": "FFFFFF",
      "size": 4,
    },
  },
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
    "masterUsername": "tfleming",
    "alreadyStarted": true,
    "roomName": "42",
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

export function addMessage(state, message) {
  return state.updateIn(['messages'], arr => {
    arr.push(message)
    return arr
  });
}




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
