import Immutable from 'immutable';
import {List, Map} from 'immutable';
import {NEW_GAME, NEW_CLIENT} from './defaultStates'
import pieces from '../both/pieces'
import {putPieceOnBoard} from '../both/utilities'

function gameInvalidOrDead(state, roomName) {
  return !state.getIn(['games', roomName]) ||
      !state.getIn(['games', roomName, 'game', 'alreadyStarted']) ||
      state.getIn(['games', roomName, 'game', 'gameOver'])
}

export function joinGame(state, socketId, roomName, username) {
  // can't join the game if it's already started
  if (state.getIn(['games', roomName, 'game', 'alreadyStarted'])) {
    return state
  }

  state = state.setIn(['sockets', socketId], Immutable.fromJS({
    roomName, username
  }))

  if (!state.getIn(['games', roomName])) {
    return state.setIn(['games', roomName], NEW_GAME)
        .setIn(['games', roomName, 'clients', username], NEW_CLIENT)
        .setIn(['games', roomName, 'game', 'masterUsername'], username)
  } else if (!state.getIn(['games', roomName, 'clients', username])) {
    return state.setIn(['games', roomName, 'clients', username], NEW_CLIENT)
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

  // remove the socket from the socket list
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

function checkWinnerState(state, roomName, username) {
  // if this is called for a username it's because they've lost - it's
  // impossible for this to be called and for the user to have won
  state = state.setIn(['games', roomName, 'clients', username, 'winnerState'], 'loser')

  let players = state.getIn(['games', roomName, 'clients'])
  if (players.size > 1) {
    var nonLosers = players.entrySeq().filter(([key, value], index) => {
        return username !== key && !value.get('winnerState')
    })
    if (nonLosers.count() === 1) {
      return state
          .setIn(['games', roomName, 'game', 'gameOver'], true)
          .setIn(['games', roomName, 'clients', nonLosers.first()[0], 'winnerState'], 'winner')
    }
    else {
      return state
    }
  }

  // there's only one person so they've lost muhahaha--no winners here
  return state.setIn(['games', roomName, 'game', 'gameOver'], true)
}

export function movePiece(state, roomName, username, direction) {
  if (gameInvalidOrDead(state, roomName)) {
    return state
  }

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
    let finalRowPosition = state.getIn(currentPiecePath.concat(['row']))
    if (finalRowPosition < 0) {
      return checkWinnerState(state, roomName, username)
    }
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
  if (gameInvalidOrDead(state, roomName)) {
    return state
  }

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
  if (gameInvalidOrDead(state, roomName)) {
    return state
  }

  let pieceIndexPath = ["games", roomName, "clients", username, "currentPieceIndex"]
  let startIndex = state.getIn(pieceIndexPath)

  while (!state.getIn(['games', roomName, 'game', 'gameOver']) &&
      state.getIn(pieceIndexPath) === startIndex) {
    state = movePiece(state, roomName, username, "down")
  }
  return state
}

export const INITIAL_STATE = Immutable.fromJS({
  sockets: {},
  games: {},
});
