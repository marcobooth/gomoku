import Immutable from 'immutable';
import {List, Map} from 'immutable';
import {NEW_GAME, NEW_CLIENT} from './defaultStates'
// import {putPieceOnBoard} from '../both/utilities'
import pieces from '../both/pieces'

export function connected(state, socketId) {
  return state.setIn(['sockets', socketId], Immutable.fromJS({}))
}

export function joinGame(state, socketId, roomName, username) {
  state = state.setIn(['sockets', socketId], Immutable.fromJS({
    roomName, username
  }))

  if (!state.getIn(['games', roomName])) {
    return state.setIn(['games', roomName], NEW_GAME)
        .setIn(['games', roomName, 'clients', username], NEW_CLIENT)
        .setIn(['games', roomName, 'game', 'masterUsername'], username)
  } else if (!state.getIn(['games', roomName, 'clients', username])) {
    return state.setIn(['games', roomName, 'clients', username], NEW_CLIENT)
  } else {
    console.log("multiplayer or a problem. TODO: store sockets per client");
  }

  return state;
}

export function startGame(state, roomName) {
  let players = state.getIn(['games', roomName, 'clients']).keySeq().toArray()
  players.forEach( function (player) {
    state = nextPiece(state, roomName, player)
  })
  return state.updateIn(['games', roomName, 'game', 'alreadyStarted'], value => { return true })
}

export function leaveGame(state, socketId) {
  let socketInfo = state.getIn(['sockets', socketId])

  if (!socketInfo) {
    return;
  }
  let { roomName, username } = socketInfo.toJS()

  if (state.getIn(['games', roomName, 'clients']).size > 1) {
    // remove the client
    state = state.deleteIn(['games', roomName, 'clients', username])

    // then we can change the master user if necessary
    state = state.updateIn(['games', roomName, 'game', 'masterUsername'], currentMaster => {
      if (currentMaster === username) {
        return state.getIn(['games', roomName, 'clients']).findKey(() => { return true })
      }

      return currentMaster
    })
  } else {
    // delete the game
    state = state.deleteIn(['games', roomName])
  }

  return state.deleteIn(['sockets', socketId])
}

export function addMessage(state, message) {
  return state.updateIn(['messages'], arr => {
    arr.push(message)
    return arr
  });
}

function nextPiece(state, roomName, player) {
  let currentPieceIndexPath = ['games', roomName, 'clients', player, 'currentPieceIndex']
  state = state.updateIn(currentPieceIndexPath, cp => cp + 1)
  let numberOfPieces = state.getIn(['games', roomName, 'game', 'pieces']).count();
  let currentPieceIndex = state.getIn(currentPieceIndexPath)
  if (numberOfPieces <= currentPieceIndex) {
    let randomNumber = Math.floor((Math.random() * 7));
    let randomPiece = pieces[randomNumber];

    state = state.updateIn(['games', roomName, 'game', 'pieces'], pieces => {
      return pieces.concat([Map({
        type: randomPiece.type,
        rotation: Math.floor((Math.random() * 4)),
        row: -(randomPiece.size),
        col: Math.floor((Math.random() * (10 - randomPiece.size))),
      })])
    })
  }
  let currentPiece = state.getIn(['games', roomName, 'game', 'pieces', currentPieceIndex])
  return state.setIn(['games', roomName, 'clients', player, 'currentPiece'], currentPiece)
}

export function checkForFullLine(state, player) {
  let board = state.getIn(['clients', player, 'board']).toJS()
  board.forEach(function (row, index) {
    if (row.indexOf(null) === -1) {
      state = state.deleteIn(['clients', player, 'board', index])
      let boardToChange = state.getIn(['clients', player, 'board']).unshift(List([null, null, null, null, null, null, null, null, null, null]))
      state = state.setIn(['clients', player, 'board'], boardToChange)
    }
  })
  return state
}

export function movePiece(state, player, direction) {
  let potentialState
  let currentPiecePath = ['clients', player, 'currentPiece']

  if (direction === 'left') {
    potentialState = state.updateIn(currentPiecePath.concat(['col']), col => col - 1)
  } else if (direction === 'right') {
    potentialState = state.updateIn(currentPiecePath.concat(['col']), col => col + 1)
  } else if (direction === 'down') {
    potentialState = state.updateIn(currentPiecePath.concat(['row']), row => row + 1)
  } else {
    return state
  }

  let boardPath = ['clients', player, 'board'];
  let potentialBoard = potentialState.getIn(boardPath)
  let newBoard = putPieceOnBoard(potentialBoard, potentialState.getIn(currentPiecePath))

  if (newBoard) {
    return potentialState
  } else if (direction === "down") {
    var newState = nextPiece(state, player);
    let boardUpdateFunc = (oldBoard) => {
      return putPieceOnBoard(oldBoard, state.getIn(currentPiecePath))
    }
    newState = newState.updateIn(boardPath, boardUpdateFunc)
    return checkForFullLine(newState, player)
  } else {
    return state
  }
}

export function endGame(state, action) {
  if (state.getIn(['game', 'alreadyStarted']) === true && state.getIn(['game', 'winner']) === false) {
    return state.updateIn(['game', 'winner'], winnerValue => true);
  }
  return state;
}

export function rotatePiece(state, action) {
  return state.updateIn(["clients", "tfleming", "currentPiece", "rotation"], rotation => {
    let newRotation = rotation + 1;

    if (newRotation > 3) {
      newRotation = 0;
    }

    return newRotation;
  });
}

export function placePiece(state, player) {
  let currPiecePath = ["clients", "tfleming", "currentPieceIndex"];
  let startIndex = state.getIn(currPiecePath);

  while (state.getIn(currPiecePath) === startIndex) {
    state = movePiece(state, player, "down");
  }

  return state;
}

export const INITIAL_STATE = Immutable.fromJS({
  sockets: {},
  games: {},
  // "sockets": {
  //   "asdklfjsoifj": { "roomName": "42", "username": "3ldsjkf" }
  // }
  // "42": {
    // "messages": [
    //   {
    //     "username": "tfleming",
    //     "message": "Hello world!",
    //     "dateCreated": new Date(),
    //   },
    // ],
    // "game": {
    //   "pieces": [
    //     {
    //       "type": "left-l",
    //       "rotation": 0,
    //       "row": 4,
    //       "col": 0,
    //     },
    //   ],
    //   "masterUsername": "",
    //   "alreadyStarted": false,
    //   "winner": false,
    //   // "roomName": "42",
    // },
    // "clients": {
    //   "tfleming": {
    //     "currentPiece": {
    //       "type": "left-l",
    //       "rotation": 0,
    //       "row": 4,
    //       "col": 0,
    //     },
    //     "currentPieceIndex": 0,
    //     "board": [
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //       [ null, null, null, null, null, null, null, null, null, null ],
    //     ],
    //     "winnerState": "winner/loser",
    //   },
    // },
  // }
});
