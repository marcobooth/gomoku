import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import {storeStateMiddleWare} from './middleware/storeStateMiddleWare'
import reducer from './reducers'
import App from './containers/app'
import {addMessage} from './actions/addMessage'
// import { Map, List } from "immutable"

const initialState = {
  messages: []
}

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(thunk, createLogger())
)

ReactDom.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('tetris'))

store.dispatch(addMessage('Hello, my name is Teo'))
store.dispatch(addMessage('Hello, my name is Marco'))
store.dispatch(addMessage('Hello, my name is Tamra'))
store.dispatch(addMessage('Hello, my name is Judy'))
