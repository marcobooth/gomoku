import Immutable from 'immutable';
import {List, Map} from 'immutable';
import {putPieceOnBoard} from '../both/utilities'
import pieces from '../both/pieces'

export function addMessage(state, message) {
  return state.updateIn(['messages'], arr => {
    arr.push(message)
    return arr
  });
}

export function nextPiece(state, action) {
  let currentPieceIndexPath = ['clients', action.player, 'currentPieceIndex']
  state = state.updateIn(currentPieceIndexPath, cp => cp + 1)
  let numberOfPieces = state.getIn(['game', 'pieces']).count();
  let currentPieceIndex = state.getIn(currentPieceIndexPath)
  if (numberOfPieces <= currentPieceIndex) {
    let randomNumber = Math.floor((Math.random() * 7));
    let listOfPieces = state.get('pieces');
    let randomPiece = pieces[randomNumber];

    // console.log("randomPiece:", randomPiece);
    state = state.updateIn(['game', 'pieces'], pieces => {
      return pieces.concat([Map({
        type: randomPiece.type,
        rotation: Math.floor((Math.random() * 4)),
        row: -(randomPiece.size),
        col: Math.floor((Math.random() * (10 - randomPiece.size))),
      })])
    })

    // console.log("state.getIn(['game', 'pieces']:", state.getIn(['game', 'pieces']))
  }
  let currentPiece = state.getIn(['game', 'pieces', currentPieceIndex])
  return state.setIn(['clients', action.player, 'currentPiece'], currentPiece)
}

export function movePiece(state, action) {
  let potentialState
  let currentPiecePath = ['clients', action.player, 'currentPiece']

  if (action.direction === 'left') {
    potentialState = state.updateIn(currentPiecePath.concat(['col']), col => col - 1)
  } else if (action.direction === 'right') {
    potentialState = state.updateIn(currentPiecePath.concat(['col']), col => col + 1)
  } else if (action.direction === 'down') {
    potentialState = state.updateIn(currentPiecePath.concat(['row']), row => row + 1)
  } else {
    return state
  }

  let boardPath = ['clients', action.player, 'board'];
  let potentialBoard = potentialState.getIn(boardPath)
  let newBoard = putPieceOnBoard(potentialBoard, potentialState.getIn(currentPiecePath))

  if (newBoard) {
    return potentialState
  } else if (action.direction === "down") {
    var newState = nextPiece(state, action);
    let boardUpdateFunc = (oldBoard) => {
      return putPieceOnBoard(oldBoard, state.getIn(currentPiecePath))
    }
    return newState.updateIn(boardPath, boardUpdateFunc)
  } else {
    return state
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
