import {expect} from 'chai';
import Immutable from 'immutable'
import { Map, List } from 'immutable'
import _ from 'underscore'
import { checkForFullLine, joinGame, leaveGame, startGame, connected, addMessage, addLinesToOpponents, nextPiece, placePiece, rotatePiece, movePiece } from '../src/server/core'
import { putPieceOnBoard } from '../src/both/utilities'


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

describe('clients joining', () => {
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

  it('multi multiplayer game', () => {
    let state = Map({});
    state = joinGame(state, '2345', '42', 'mbooth');
    state = joinGame(state, '2346', '42', 'mbooth');

    expect(state.getIn(['sockets', '2345'])).to.equal(Map({
      'roomName': '42',
      'username': 'mbooth',
    }))

    expect(state.getIn(['sockets', '2346'])).to.equal(Map({
      'roomName': '42',
      'username': 'mbooth',
    }))
  })
})

describe('clients leaving', () => {
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

  it ('with no socket info', () => {
    let state = Map({});
    state = joinGame(state, '1234', '42', 'tfleming');
    let nextState = leaveGame(state, '')

    expect(state).to.equal(nextState)
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
  it('around 1', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = startGame(state, '42')
    state = state.updateIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'], rotation => { return 0 } )
    state = rotatePiece(state, '42', 'tfleming')

    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'])).to.equal(1)
  })
  it('fully', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = startGame(state, '42')
    state = state.updateIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'], rotation => { return 3 } )
    state = rotatePiece(state, '42', 'tfleming')

    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'])).to.equal(0)
  })

  it('along the left edge where it has to move it to rotate', () => {
    let state = joinGame(Map({}), '1234', '42', 'tfleming')
    state = startGame(state, '42')
    state = state.setIn(['games', '42', 'clients', 'tfleming', 'currentPiece'], Immutable.fromJS({
      col: -2,
      row: 0,
      rotation: 1,
      type: "long-straight",
    }))

    state = rotatePiece(state, '42', 'tfleming')

    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'])).to.equal(2)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'row'])).to.equal(0)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'])).to.equal(0)
  })

  it('along the right edge where it has to move it to rotate', () => {
    let state = joinGame(Map({}), '1234', '42', 'tfleming')
    state = startGame(state, '42')
    state = state.setIn(['games', '42', 'clients', 'tfleming', 'currentPiece'], Immutable.fromJS({
      col: 8,
      row: 0,
      rotation: 3,
      type: "long-straight",
    }))

    state = rotatePiece(state, '42', 'tfleming')

    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'])).to.equal(0)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'row'])).to.equal(0)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'])).to.equal(6)
  })

  // set up a starting state for the following two tests
  let rotationState = joinGame(Map({}), '1234', '42', 'tfleming')
  rotationState = startGame(rotationState, '42')
  rotationState = rotationState.setIn(['games', '42', 'clients', 'tfleming', 'board'], Immutable.fromJS([
    ['F', 'F', 'F', null, null, null, 'F', 'F', 'F', 'F'],
    ['F', 'F', 'F', null, null, null, 'F', 'F', 'F', 'F'],
    ['F', 'F', 'F', null, null, null, 'F', 'F', 'F', 'F'],
    ['F', 'F', 'F', null, null, null, 'F', 'F', 'F', 'F'],
    ['F', 'F', 'F', null, null, null, 'F', 'F', 'F', 'F'],
    ['F', 'F', 'F', null, null, null, 'F', 'F', 'F', 'F'],
  ]))

  it('where it can actually rotate unobstructed', () => {
    let state = rotationState.setIn(['games', '42', 'clients', 'tfleming', 'currentPiece'], Immutable.fromJS({
      col: 3,
      row: 1,
      rotation: 1,
      type: "sombrero",
    }))

    state = rotatePiece(state, '42', 'tfleming')

    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'])).to.equal(3)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'row'])).to.equal(1)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'])).to.equal(2)

    state = rotatePiece(state, '42', 'tfleming')
    state = rotatePiece(state, '42', 'tfleming')
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'])).to.equal(0)
  })

  it('along a line of pieces that will obstruct it on the left', () => {
    let state = rotationState.setIn(['games', '42', 'clients', 'tfleming', 'currentPiece'], Immutable.fromJS({
      col: 2,
      row: 0,
      rotation: 1,
      type: "sombrero",
    }))

    state = rotatePiece(state, '42', 'tfleming')

    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'])).to.equal(3)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'row'])).to.equal(0)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'])).to.equal(2)
  })

  it('along a line of pieces that will obstruct it on the right', () => {
    let state = rotationState.setIn(['games', '42', 'clients', 'tfleming', 'currentPiece'], Immutable.fromJS({
      col: 4,
      row: 1,
      rotation: 3,
      type: "sombrero",
    }))

    state = rotatePiece(state, '42', 'tfleming')

    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'])).to.equal(3)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'row'])).to.equal(1)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'])).to.equal(0)
  })

  it("where it can't rotate", () => {
    let state = rotationState.setIn(['games', '42', 'clients', 'tfleming', 'currentPiece'], Immutable.fromJS({
      col: 3,
      row: 0,
      rotation: 1,
      type: "long-straight",
    }))

    state = rotatePiece(state, '42', 'tfleming')

    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'])).to.equal(3)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'row'])).to.equal(0)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'])).to.equal(1)
  })
})

describe('move piece', () => {
  it('moves to the left and right and down', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = startGame(state, '42')

    state = state.updateIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'], col => { return 5 } )
    state = movePiece(state, '42', 'tfleming', 'left')
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'])).to.equal(4)

    state = state.updateIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'], col => { return 5 } )
    state = movePiece(state, '42', 'tfleming', 'right')
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'])).to.equal(6)

    state = state.updateIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'row'], row => { return 5 } )
    state = movePiece(state, '42', 'tfleming', 'down')
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'row'])).to.equal(6)
  })

  it('piece does not move', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = startGame(state, '42')

    state = state.updateIn(['games', '42', 'clients', 'tfleming', 'currentPiece'], piece => {
      return Map({
        "type": "left-l",
        "rotation": 0,
        "row": 4,
        "col": 0,
      })
     })
    state = movePiece(state, '42', 'tfleming', 'left')
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'])).to.equal(0)
  })

  it('invalid move', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = startGame(state, '42')
    let nextState = movePiece(state, '42', 'tfleming', 'wrong')

    expect(state).to.equal(nextState)
  })
})

describe('adds lines to opponents', () => {
  it('number: 1', () => {
    let state = Map({})
    state = joinGame(state, '1234', '42', 'tfleming')
    state = joinGame(state, '2149', '42', 'mbooth')
    state = startGame(state, '42')
    state = addLinesToOpponents(state, '42', 'tfleming', 1)

    // expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPieceIndex'])).to.equal(1)
  })
})
