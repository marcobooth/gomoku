import Immutable from 'immutable';
import { List, Map } from 'immutable';

export function startGame(state) {
  return state.update(['test'], value => { return true })
}

function changePlayer(state) {
  let nextPlayerWithMove = state.get("player") == 1 ? 2 : 1
  return state.updateIn(["player"], currentPlayer => { return nextPlayerWithMove })
}

export function placePiece(state, mainKey, secondKey) {
  let current_colour = state.get("player") == 1 ? "black" : "red"
  let newState = state.updateIn(['board', mainKey, secondKey], colour => { return current_colour })
  return changePlayer(newState)
}

export const INITIAL_STATE = Immutable.fromJS({
  "player": 1,
  "test": false,
  "alreadyStarted": true,
  "board": [
    [ "red", "grey", "grey", "grey", "grey" ],
    [ "grey", "grey", "grey", "grey", "grey" ],
    [ "grey", "grey", "grey", "grey", "grey" ],
    [ "grey", "grey", "grey", "grey", "grey" ],
    [ "grey", "grey", "grey", "grey", "grey" ],
    [ "grey", "grey", "grey", "grey", "grey" ],
    [ "grey", "grey", "grey", "grey", "grey" ],
  ],
})
