import {expect} from 'chai';
import Immutable from 'immutable'
import { Map } from 'immutable'
import _ from 'underscore'
import { EXAMPLE_STATE } from './stateExample'
import { checkForFullLine, joinGame, leaveGame, startGame } from '../src/server/core'


describe('full line removal', () => {
  it('multiple lines', () => {
    const emptyBoard = Immutable.fromJS(
    [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
    const nextState = checkForFullLine(EXAMPLE_STATE, 'tfleming');
    let newBoard = nextState.getIn(['clients', 'tfleming', 'board'])
    expect(newBoard).to.equal(emptyBoard);
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

  it ('creates the game', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    // list of pieces, alreadyStarted, currentPiece, currentPieceIndex (for all players)
    state = startGame(state, '42')
    console.log("game state:", state);
    expect(state.getIn(['games', '42', 'game', 'pieces']).size).to.equal(1)
    expect(state.getIn(['games', '42', 'game', 'alreadyStarted'])).to.equal(true)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece'])).to.exist
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPieceIndex'])).to.equal(0)





  })
})
