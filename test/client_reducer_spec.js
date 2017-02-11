import {expect} from 'chai';
import Immutable from 'immutable'
import { Map, List } from 'immutable'
import { connected, setState } from '../src/client/actions/allActions'
import reducer from '../src/client/reducers/allReducers'

describe('reducer', () => {
  it('connects to server', () => {
    let state = Map({})

    let action = connected()
    state = reducer(state, action)
    expect(state.get('connected')).to.equal(true);
  })

  it('set initial state', () => {
    let state = Map({})
    let initialState = Map({
      masterUsername: 'tfleminge'
    })
    let action = setState(initialState)
    state = reducer(state, action)
    console.log("state.get():", state.get());
    expect(state).to.equal(initialState)
  })

})
