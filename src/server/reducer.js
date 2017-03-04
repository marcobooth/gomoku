import {
  getBestMove,
  declareWinner,
  INITIAL_STATE,
  placePiece,
} from './core';
import fs from 'fs'

const returnState = () => {
  return {
    meta: { remote: true },
    type: "RETURN_STATE",
  }
}

export default function reducer(state = INITIAL_STATE, action) {
  console.log("action in reducer:", action)

  if (action.type === 'START_ENGINE') {
    console.log("change state to running")
    getBestMove(state)
      .then((value) => {
        fs.readFile('./output.log', 'utf8', function (err,data) {
          if (err) {
            return console.log(err)
          }
          console.log("data:", data)
          if (data === "winner\n") {
            action.asyncDispatch({
              type: 'DECLARE_WINNER',
            })
          } else if (data === "validMove\n") {
            action.asyncDispatch({
              type: 'PLACE_PIECE',
              mainKey: action.mainKey,
              secondKey: action.secondKey,
            })
          } else if (data === "invalidMove\n") {
            action.asyncDispatch({
              type: 'INVALID_MOVE',
            })
          } else {
            console.log("nothing");
          }
          fs.writeFile('./output.log', '')
        })
        console.log("did something, about to call asyncDispatch")
      })
      .catch((reason) => {
        action.asyncDispatch({ type: 'ENGINE_FAILURE' })
      })
    console.log("returning from reducer: loading set to true")
    return state.set("loading", true)
  } else if (action.type === 'DECLARE_WINNER') {
    return declareWinner(state)
  } else if (action.type === 'PLACE_PIECE') {
    return placePiece(state, action.mainKey, action.secondKey)
  }

  return state



  // // TODO change state to pending while in child process
  // if (action.type === "RETURN_STATE") {
  //   console.log("in here now");
  //   return state
  // }
  //
  // getBestMove(state)
  //   .then((value) => {
  //     fs.readFile('./output.log', 'utf8', function (err,data) {
  //       if (err) {
  //         return console.log(err)
  //       }
  //       console.log("data:", data)
  //       if (data === "winner\n") {
  //         state = declareWinner(state)
  //       } else if (data === "validMove\n") {
  //         console.log("valid move");
  //         state = placePiece(state, action.mainKey, action.secondKey)
  //         reducer(state, returnState)
  //       } else if (data === "invalidMove\n") {
  //         state = error(state)
  //       } else {
  //         console.log("nothing");
  //       }
  //       return state
  //     })
  //     fs.writeFile('./output.log', '')
  //   })
  //   .catch((reason) => {
  //     console.log('Handle rejected promise ('+reason+') here.');
  //   })
  // return state
}
