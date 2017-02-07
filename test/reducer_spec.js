import {expect} from 'chai';
import Immutable from 'immutable'
import { Map, List } from 'immutable'
import { addMessage, movePiece, rotatePiece, placePiece, joinGame, startGame } from '../src/client/actions/allActions'
import reducer from '../src/server/reducer'
import { startGame as start } from '../src/server/core'
import { joinGame as join } from '../src/server/core'

describe('reducer', () => {
  it('adds a message', () => {
    let state = Map({})
    state = join(state, '1234', '42', 'tfleming')
    state = start(state, '42')

    let action = addMessage('42', 'tfleming', 'hello there')
    state = reducer(state, action)
    expect(state.getIn(['games', '42', 'messages']).size).to.equal(1);
  })

  it('moves a piece', () => {
    let state = Map({})
    state = join(state, '1234', '42', 'tfleming')
    state = start(state, '42')
    state = state.updateIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'], col => { return 5 } )
    let action = movePiece('42', 'tfleming', 'left')
    state = reducer(state, action)

    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'col'])).to.equal(4)
  })

  it('rotates a piece', () => {
    let state = Map({})
    state = join(state, '1234', '42', 'tfleming')
    state = start(state, '42')
    state = state.updateIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'], rotation => { return 0 } )
    let action = rotatePiece('42', 'tfleming')

    state = reducer(state, action)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece', 'rotation'])).to.equal(1)
  })

  it('places a piece', () => {
    let state = Map({})
    state = join(state, '1234', '42', 'tfleming')
    state = start(state, '42')
    let action = placePiece('42', 'tfleming')
    state = reducer(state, action)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPieceIndex'])).to.equal(1)
  })

  it('joins a game', () => {
    let state = Map({})
    let action = joinGame('42', 'tfleming')
    action.socketId = '1234'
    state = reducer(state, action)
    expect(state.getIn(['games', '42', 'clients', 'tfleming'])).to.exist
  })

  it('leaves a game', () => {
    let state = Map({})
    state = join(state, '1234', '42', 'tfleming')

    let action = {
      type: 'LEAVE_GAME',
      socketId: '1234'
    }
    state = reducer(state, action)
    expect(state.getIn(['games', '42', 'clients', 'tfleming'])).to.not.exist
    expect(state.getIn(['sockets', '1234'])).to.not.exist
  })

  it('starts a game', () => {
    let state = Map({})
    state = join(state, '1234', '42', 'tfleming')

    let action = startGame('42', 'tfleming')
    state = reducer(state, action)
    expect(state.getIn(['games', '42', 'game', 'pieces']).size).to.equal(1)
    expect(state.getIn(['games', '42', 'game', 'alreadyStarted'])).to.equal(true)
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPiece'])).to.exist
    expect(state.getIn(['games', '42', 'clients', 'tfleming', 'currentPieceIndex'])).to.equal(0)
  })
})
