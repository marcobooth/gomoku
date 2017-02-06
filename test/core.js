import {expect} from 'chai';
import Immutable from 'immutable'
import { Map } from 'immutable'
import _ from 'underscore'
import { EXAMPLE_STATE } from './stateExample'
import { checkForFullLine, joinGame } from '../src/server/core'


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

    expect(nextState.getIn(['sockets',]))
    expect(nextState.getIn(['42', 'clients', 'tfleming'])).to.exist
    expect(nextState.getIn(['42', 'game', 'masterUsername'])).to.equal('tfleming')
  })

  it('multiplayer game', () => {
    let state = Map({});
    state = joinGame(state, '42', 'tfleming');
    state = joinGame(state, '42', 'mbooth');

    expect(state.getIn(['42', 'clients', 'tfleming'])).to.exist
    expect(state.getIn(['42', 'clients', 'mbooth'])).to.exist

    expect(state.getIn(['42', 'game', 'masterUsername'])).to.equal('tfleming')
  })
})
