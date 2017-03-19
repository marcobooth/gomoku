import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '../collections.js'
const { exec } = require('child_process');
import { createEngineState } from "../../engine/gomokuEngine"
import { ensureLoggedIn } from '../../utilities/ensureLoggedIn.js'

function playerMoved(game) {
  Games.update(game._id, {
    $set: {
      currentPlayer: game.currentPlayer === game.p1 ? game.p2 : game.p1,
    }
  });
}

function playerWon(game) {
  Games.update(game._id, {
    $set: {
      status: "winner"
    }
  })

  Meteor.users.update(game.currentPlayer, {
    $inc: {
      won: 1
    }
  })
}

function setBoard(gameId, board) {
  Games.update(gameId, {
    $set: {
      board
    }
  })
}

Meteor.methods({
  'games.handleMove'(gameId, rowIndex, pointIndex) {
    check(gameId, String);
    check(rowIndex, Number);
    check(pointIndex, Number);

    let game = Games.findOne(gameId);
    // console.log("game:", game)
    // set an updating attribute, only allow one thing at a time

    // TODO: ensure logged in and make sure the current player is the one
    // making the move

    if (game.board[rowIndex][pointIndex]) {
      throw new Meteor.Error("cell-taken")
    }

    let otherPlayer = game.currentPlayer === game.p1 ? game.p2 : game.p1
    let state = createEngineState(game.currentPlayer, otherPlayer, game.board)
    state = state.move({
      row: rowIndex,
      col: pointIndex
    })

    if (!state) {
      return new Meteor.Errir("invalid-move")
    }

    setBoard(gameId, state.getStringBoard())

    if (state.hasWinner()) {
      playerWon(game)
      return
    }

    playerMoved(game)

    // if it's vs. AI, figure out the best move and then move there
    game = Games.findOne(game._id)
    if (game.currentPlayer === "AI") {

    }

    //   let nextPlayer = game.currentPlayer === game.p1 ? game.p2 : game.p1
    //   Games.update(gameId, {
    //     $set: {
    //       [`board.${rowIndex}.${pointIndex}`]: game.currentPlayer,
    //       currentPlayer: nextPlayer
    //     }
    //   });
    //
    //     } else if (stdout === "validmove\n") {
    //       console.log("I'm in the valid move");
    //       console.log("game:", game)
    //       let newGameArray = game.board
    //       newGameArray[rowIndex][pointIndex] = game.currentPlayer
    //       let currentPlayer = game.currentPlayer === game.p1 ? game.p2 : game.p1
    //       // TODO ask flenge how to add to part of the array
    //       Games.update(gameId, {
    //         $set: {
    //           board: newGameArray,
    //           currentPlayer: currentPlayer
    //         }
    //       });
    //     } else {
    //       console.log("In the other");
    //       console.log("stdout:", stdout)
    //       console.log("stdout === winner:", stdout == "winner")
    //       // TODO ask flenge how to send error to client
    //       throw new Meteor.Error("create-failed");
    //     }
    //   }))
    // } else {
    //   console.log("point has already been taken");
    // }
  }
})
