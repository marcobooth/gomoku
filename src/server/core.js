import Immutable from 'immutable';
import {List, Map} from 'immutable';
import {NEW_GAME, NEW_CLIENT} from './defaultStates'
import pieces from '../both/pieces'
import {putPieceOnBoard} from '../both/utilities'

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
  players.forEach( function (username) {
    state = nextPiece(state, roomName, username)
  })
  return state.updateIn(['games', roomName, 'game', 'alreadyStarted'], value => { return true })
}

export function leaveGame(state, socketId) {
  let socketInfo = state.getIn(['sockets', socketId])
  if (!socketInfo) {
    return state;
  }

  let { roomName, username } = socketInfo.toJS()

  let clients = state.getIn(['games', roomName, 'clients'])
  if (clients && clients.size > 1) {
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
  console.log("state:", state);
  return state.deleteIn(['sockets', socketId])
}

export function addMessage(state, roomName, username, message) {
  return state.updateIn(['games', roomName, 'messages'], messages => {
    return messages.push({
      username,
      message,
      "dateCreated": new Date(),
    })
  });
}

export function nextPiece(state, roomName, username) {
  let currentPieceIndexPath = ['games', roomName, 'clients', username, 'currentPieceIndex']
  state = state.updateIn(currentPieceIndexPath, cp => cp + 1)
  let numberOfPieces = state.getIn(['games', roomName, 'game', 'pieces']).count();
  let currentPieceIndex = state.getIn(currentPieceIndexPath)
  if (numberOfPieces <= currentPieceIndex) {
    let randomNumber = Math.floor((Math.random() * pieces.length));
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
  return state.setIn(['games', roomName, 'clients', username, 'currentPiece'], currentPiece)
}

export function checkForFullLine(state, roomName, username) {
  let board = state.getIn(['games', roomName, 'clients', username, 'board']).toJS()
  board.forEach(function (row, index) {
    if (row.indexOf(null) === -1) {
      state = state.deleteIn(['games', roomName, 'clients', username, 'board', index])
      let boardToChange = state.getIn(['games', roomName, 'clients', username, 'board'])
          .unshift(List([null, null, null, null, null, null, null, null, null, null]))
      state = state.setIn(['games', roomName, 'clients', username, 'board'], boardToChange)
    }
  })
  return state
}

export function movePiece(state, roomName, username, direction) {
  let potentialState
  let currentPiecePath = ['games', roomName, 'clients', username, 'currentPiece']

  if (direction === 'left') {
    potentialState = state.updateIn(currentPiecePath.concat(['col']), col => col - 1)
  } else if (direction === 'right') {
    potentialState = state.updateIn(currentPiecePath.concat(['col']), col => col + 1)
  } else if (direction === 'down') {
    potentialState = state.updateIn(currentPiecePath.concat(['row']), row => row + 1)
  } else {
    return state
  }

  let boardPath = ['games', roomName, 'clients', username, 'board'];
  let potentialBoard = potentialState.getIn(boardPath)
  let newBoard = putPieceOnBoard(potentialBoard, potentialState.getIn(currentPiecePath))

  if (newBoard) {
    return potentialState
  } else if (direction === "down") {
    var newState = nextPiece(state, roomName, username);
    let boardUpdateFunc = (oldBoard) => {
      return putPieceOnBoard(oldBoard, state.getIn(currentPiecePath))
    }
    newState = newState.updateIn(boardPath, boardUpdateFunc)
    return checkForFullLine(newState, roomName, username)
  } else {
    return state
  }
}

export function rotatePiece(state, roomName, username) {
  return state.updateIn(["games", roomName, "clients", username, "currentPiece"], originalPiece => {
    let piece = originalPiece.update('rotation', rotation => rotation + 1)

    if (piece.get('rotation') > 3) {
      piece = piece.set('rotation', 0)
    }

    // make sure it'll work rotated
    let board = state.getIn(['games', roomName, 'clients', username, 'board'])
    if (putPieceOnBoard(board, piece)) {
      return piece
    }

    // okay, so it didn't work... let's try moving it around a bit
    let possibleDeltas = [ -1, 1, -2, 2 ]

    for (let deltaCol of possibleDeltas) {
      let movedPiece = piece.update('col', (col) => { return col + deltaCol })

      if (putPieceOnBoard(board, movedPiece)) {
        return movedPiece
      }
    }

    // the piece can't rotate :(
    return originalPiece
  });
}

export function placePiece(state, roomName, username) {
  let currPiecePath = ["games", roomName, "clients", username, "currentPieceIndex"];
  let startIndex = state.getIn(currPiecePath);

  while (state.getIn(currPiecePath) === startIndex) {
    state = movePiece(state, roomName, username, "down");
  }
  return state;
}

export const INITIAL_STATE = Immutable.fromJS({
  sockets: {},
  games: {},
});
