import {expect} from 'chai';
import Immutable from 'immutable'
import { Map, List } from 'immutable'
import _ from 'underscore'
import { checkForFullLine, joinGame, leaveGame, startGame, connected, addMessage, nextPiece, placePiece, rotatePiece, movePiece } from '../src/server/core'


describe('full line removal', () => {
  it('single line', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = startGame(state, '42')
    state = state.updateIn(['games', '42', 'clients', 'tfleming', 'board', 0], row => { return ["colour", "colour", "colour", "colour", "colour", "colour", "colour", "colour", "colour", "colour"] })
    state = checkForFullLine(state, '42', 'tfleming');
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'board', 0])).to.equal(List([null, null, null, null, null, null, null, null, null, null]));
  });
});

describe('clients joining and leaving', () => {
  it('creates a new game', () => {
    const state = Map({});
    const nextState = joinGame(state, '1234', '42', 'tfleming');

    expect(nextState.getIn(['sockets', '1234'])).to.equal(Map({
      'roomName': '42',
      'username': 'tfleming',
    }))
    expect(nextState.getIn(['games', '42', 'clients', 'tfleming'])).to.exist
    expect(nextState.getIn(['games', '42', 'game', 'masterUsername'])).to.equal('tfleming')
  })

  it('multiplayer game', () => {
    let state = Map({});
    state = joinGame(state, '1234', '42', 'tfleming');
    state = joinGame(state, '2345', '42', 'mbooth');

    expect(state.getIn(['games', '42', 'clients', 'tfleming'])).to.exist
    expect(state.getIn(['games', '42', 'clients', 'mbooth'])).to.exist

    expect(state.getIn(['sockets', '1234'])).to.equal(Map({
      'roomName': '42',
      'username': 'tfleming',
    }))
    expect(state.getIn(['sockets', '2345'])).to.equal(Map({
      'roomName': '42',
      'username': 'mbooth',
    }))

    expect(state.getIn(['games', '42', 'game', 'masterUsername'])).to.equal('tfleming')
  })

  it ('leave da game', () => {
    let state = Map({});
    state = joinGame(state, '1234', '42', 'tfleming');
    state = joinGame(state, '2345', '42', 'mbooth');
    state = leaveGame(state, '1234')

    expect(state.getIn(['games', '42', 'clients', 'tfleming'])).to.not.exist
    expect(state.getIn(['games', '42', 'clients', 'mbooth'])).to.exist

    expect(state.getIn(['sockets', '1234'])).to.not.exist

    expect(state.getIn(['games', '42', 'game', 'masterUsername'])).to.equal('mbooth')

    state = leaveGame(state, '2345')
    expect(state.getIn(['games', '42'])).to.not.exist
  })
})

describe('starting the game', () => {
  it ('single player', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = startGame(state, '42')
    expect(state.getIn(['games', '42', 'game', 'pieces']).size).to.equal(1)
    expect(state.getIn(['games', '42', 'game', 'alreadyStarted'])).to.equal(true)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece'])).to.exist
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPieceIndex'])).to.equal(0)
  })

  it ('multi player', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = joinGame(state, '2345', '42', 'mbooth')

    // list of pieces, alreadyStarted, currentPiece, currentPieceIndex (for all players)
    state = startGame(state, '42')
    expect(state.getIn(['games', '42', 'game', 'pieces']).size).to.equal(1)
    expect(state.getIn(['games', '42', 'game', 'alreadyStarted'])).to.equal(true)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece'])).to.exist
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPieceIndex'])).to.equal(0)
    expect(state.getIn(['games', '42', 'clients', 'mbooth', 'currentPiece'])).to.exist
    expect(state.getIn(['games', '42', 'clients', 'mbooth', 'currentPieceIndex'])).to.equal(0)
  })
})

describe('connecting', () => {
  it('adds the socket', () => {
    let state = Map({})
    state = connected(state, '234')
    expect(state.get("sockets")).to.equal(Map({
      "234": Map({})
    }));
  })
})

describe('sending a message', () => {
  it ('basic version', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = addMessage(state, '42', 'tfleming', 'well hello there')
    state = addMessage(state, '42', 'tfleming', 'well hello buddy')
    expect(state.getIn(['games', '42', 'messages']).size).to.equal(2)
  })
})

describe('next piece', () => {
  it('must create a new piece', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = startGame(state, '42')
    state = nextPiece(state, '42', 'tfleming')
    expect(state.getIn(['games', '42', 'game', 'pieces']).size).to.equal(2)
  })

  it('must not create a new piece', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = joinGame(state, '2345', '42', 'mbooth')
    state = startGame(state, '42')
    state = nextPiece(state, '42', 'tfleming')
    state = nextPiece(state, '42', 'mbooth')
    expect(state.getIn(['games', '42', 'game', 'pieces']).size).to.equal(2)

  })
})

describe('place piece', () => {
  it('well', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = startGame(state, '42')
    state = placePiece(state, '42', 'tfleming')
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPieceIndex'])).to.equal(1)
  })
})

describe('rotate piece', () => {
  it('around', () => {
    // let state = Map({})
    // state = joinGame(state, '1234', '42', 'tfleming')
    // state = startGame(state, '42')
    // state = rotatePiece(state, '42', 'tfleming')
    //
    // expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPieceIndex'])).to.equal(1)
  })
})
