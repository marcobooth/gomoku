import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass
} from 'react-addons-test-utils';
import Board from '../src/client/containers/board';
import {expect} from 'chai';
import Immutable from 'immutable'

describe('Board', () => {
  let boardInput = Immutable.fromJS([[null, null], [null, null], [null, null]])

  it('renders', () => {
    const component = renderIntoDocument(
      <Board board={boardInput} squareSize={2} />
    );

    const rows = scryRenderedDOMComponentsWithClass(component, 'row');
    expect(rows.length).to.equal(boardInput.size);
  });

});
