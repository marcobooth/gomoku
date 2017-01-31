export default socket => store => next => action => {
  if (action.meta && action.meta.remote) {
    console.log("emitting action");
    socket.emit('action', action);
  }
  return next(action);
}

// export const storeStateMiddleWare = ({ getState }) => {
//   return (next) => (action) => {
//     let returnValue = next(action)
//     window.top.state = getState()
//     return returnValue
//   }
// }
