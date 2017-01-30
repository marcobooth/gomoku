import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import io from 'socket.io-client';
import remoteActionMiddleware from './middleware/storeStateMiddleWare'
import reducer from './reducers/allReducers'
import App from './containers/app'
import {addMessage, setState} from './actions/allActions'
// import { Map, List } from "immutable"

const socket = io(`${location.protocol}//${location.hostname}:8090`);
socket.on('state', state => {
  console.log("state:", state);
  store.dispatch(setState(state))
});

const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware(socket)
)(createStore);
const store = createStoreWithMiddleware(reducer);

ReactDom.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('tetris'))
