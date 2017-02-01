import {expect} from 'chai';
import Immutable from 'immutable'
import _ from 'underscore'
import { EXAMPLE_STATE } from './stateExample'
import { checkForFullLine } from '../src/server/core'


describe('piece that is not in board area', () => {
  it('outside right', () => {
    const board = Immutable.fromJS(
    [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
    const nextState = checkForFullLine(EXAMPLE_STATE, 'tfleming');
    let newBoard = nextState.getIn(['clients', 'tfleming', 'board'])
    expect(newBoard).to.equal(board);
  });
});
