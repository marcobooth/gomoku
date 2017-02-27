import Immutable from 'immutable';
import { List, Map } from 'immutable';
import { verticalWinningState, horizontalWinningState, rightDiagonalWinningState, leftDiagonalWinningState } from './library'
var spawn = require("child_process").spawn
var fs = require('fs')
var path = require('path')

function checkForWinner(state) {
  var currentPlayer = state.get("player")
  var board = state.get("board").toJS()
  for (var i = 0; i < board.length; i++) {
    for(var j = 0; j < board[i].length; j++) {
      if (verticalWinningState(board, currentPlayer, [i, j])      ||
          horizontalWinningState(board, currentPlayer, [i, j])    ||
          rightDiagonalWinningState(board, currentPlayer, [i, j]) ||
          leftDiagonalWinningState(board, currentPlayer, [i, j])) {
            console.log("winner");
          }
    }
  }
}

function changePlayer(state) {
  let nextPlayerWithMove = state.get("player") == 1 ? 2 : 1
  return state.updateIn(["player"], currentPlayer => { return nextPlayerWithMove })
}

export function placePiece(state, mainKey, secondKey) {
  // let currentColour = state.get("player") == 1 ? "black" : "red"
  // let newState = state.updateIn(['board', mainKey, secondKey], colour => { return currentColour })
  // checkForWinner(newState)
  // return changePlayer(newState)
  return state
}

export function callChildProcess() {
  var stdout = fs.openSync("output.log", "a");
  var stderr = fs.openSync("another.log", "a");

  let command = "ls"
  let args = ["-lA"]
  let cwd = "/tmp/testing/"

  var proc = spawn(command, args, {
      cwd: cwd,
      stdio: ["inherit", stdout, stderr]
  });
  proc.on("error", function (error) {
      console.log("some sort of error");
  });
  proc.on("exit", function(code) {
      console.log('some sort of success');
  });
  return 0
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
