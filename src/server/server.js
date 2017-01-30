import Server from 'socket.io';

export default function startServer(store) {
  const io = new Server().attach(8090);

  store.subscribe(
    () => {
      console.log("new state:", store.getState().toJS().messages)
      io.emit('state', store.getState().toJS())
    }
  );

  io.on('connection', (socket) => {
    console.log("on connection");
    socket.emit('state', store.getState().toJS());
    socket.on('action', store.dispatch.bind(store));
  });
}
