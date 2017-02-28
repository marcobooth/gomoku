import Server from 'socket.io';
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer';

import fs  from 'fs'
import debug from 'debug'

const logerror = debug('tetris:error')
  , loginfo = debug('tetris:info')

const initApp = (app, params, cb) => {
  const {host, port} = params
  const handler = (req, res) => {
    const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html'
    fs.readFile(__dirname + file, (err, data) => {
      if (err) {
        logerror(err)
        res.writeHead(500)
        return res.end('Error loading index.html')
      }
      res.writeHead(200)
      res.end(data)
    })
  }

  app.on('request', handler)

  app.listen({host, port}, () =>{
    loginfo(`tetris listen on ${params.url}`)
    cb()
  })
}

const initEngine = io => {
  let store = createStore(reducer);

  const boundDispatch = store.dispatch.bind(store)

  store.subscribe(() => {
    io.emit('state', store.getState().toJS())
  });

  io.on('connection', (socket) => {
    loginfo("Socket connected: " + socket.id)

    // set up the state and action bits to connect to the client
    socket.emit('connected', store.getState().toJS());

    // "Incoming" middleware adapted from: http://stackoverflow.com/a/41260990
    socket.on('action', (action) => {
      console.log("socket got an action:", action)
      let syncActivityFinished = false;
      let actionQueue = [];

      function flushQueue() {
        actionQueue.forEach(a => boundDispatch(a));
        actionQueue = [];
      }

      function asyncDispatch(asyncAction) {
        actionQueue = actionQueue.concat([asyncAction]);

        if (syncActivityFinished) {
          flushQueue();
        }
      }

      const actionWithAsyncDispatch = Object.assign({}, action, { asyncDispatch });

      boundDispatch(actionWithAsyncDispatch)
      syncActivityFinished = true;
      flushQueue();
    })
  });
}

export function create(params){
  return new Promise( (resolve, reject) => {
    const app = require('http').createServer()

    initApp(app, params, () => {
      const io = require('socket.io')(app)
      const stop = (cb) => {
        io.close()
        app.close( () => {
          app.unref()
        })
        loginfo(`Engine stopped.`)
        cb()
      }

      initEngine(io)
      resolve({stop})
    })
  })
}

create({
  host: '0.0.0.0',
  port: (process.env.PORT || 8090),
  get url(){ return 'http://' + this.host + ':' + this.port }
}).then( () => console.log('not yet ready to play tetris with U ...') )
