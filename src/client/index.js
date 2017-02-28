import React from 'react'
import ReactDom from 'react-dom'
import { Router, Route, hashHistory, Redirect } from 'react-router';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import io from 'socket.io-client';
import reducer from './reducers/allReducers'
import { setState } from './actions/allActions'

import App from './containers/app'
import { GameContainer } from './containers/game'
import { CreateGameContainer } from './containers/createGame'

// const socket = io.connect();
const socket = io(`${location.protocol}//${location.hostname}:8090`);

socket.on('state', state => {
  store.dispatch(setState(state))
});
socket.on('connected', (state) => {
  store.dispatch(setState(state))
})

var remoteActionMiddleware = socket => store => next => action => {
  if (action.meta && action.meta.remote) {
    action.socketId = socket.id

    console.log("emitting action:", action);
    socket.emit('action', action);
  }
  return next(action)
}

const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware(socket)
)(createStore);
const store = createStoreWithMiddleware(reducer);

const routes = <Route component={App}>
  <Route path="/gomoku" component={GameContainer} />
  <Route path='/create' component={CreateGameContainer} />
  <Redirect from='*' to='/create' />
</Route>

ReactDom.render((
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>
), document.getElementById('gomoku'))
