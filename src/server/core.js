import Immutable from 'immutable';
import { List, Map } from 'immutable';
var spawn = require("child_process").spawn
var fs = require('fs')
var path = require('path')

function changePlayer(state) {
  let nextPlayerWithMove = state.get("player") == 1 ? 2 : 1
  return state.updateIn(["player"], currentPlayer => { return nextPlayerWithMove })
}

export function declareWinner(state) {
  let currentPlayer = state.get("player") == 1 ? "black" : "red"
  return state.set('winner', currentPlayer)
}

export function placePiece(state, mainKey, secondKey) {
  let currentColour = state.get("player") == 1 ? "black" : "red"
  let newState = state.updateIn(['board', mainKey, secondKey], colour => { return currentColour })
  return changePlayer(newState)
}

export function getBestMove(state) {
  // no getting stderror output, unclear if I should
  let board = state.get("board").toJS()
  let output = fs.openSync("output.log", "w");
  let args = ["engine.py"]

  for (var i = 0; i < board.length; i++) {
    args.push(board[i])
  }

  return new Promise((resolve, reject) => {
    var proc = spawn("python", args, {
        cwd: "./ai-engine/",
        stdio: ["inherit", output]
    });
    proc.on("error", reject);
    proc.on("exit", function(code) {
      resolve(code);
    });
  })
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
