import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '../collections.js'
const { exec } = require('child_process');
import { ensureLoggedIn } from '../../utilities/ensureLoggedIn.js'
import { createEngineState } from "../../engine/gomokuEngine"

function playerMoved(game) {

}

Meteor.methods({
  'games.handleMove'(gameId, rowIndex, pointIndex) {
    check(gameId, String);
    check(rowIndex, Number);
    check(pointIndex, Number);

    let userId = Meteor.userId()
    ensureLoggedIn(userId)

    let game = Games.findOne(gameId);

    let playingForAI = game.currentPlayer === "AI" &&
        (userId === game.p1 || userId === game.p2)
    if (userId !== game.currentPlayer && !playingForAI) {
      throw new Meteor.Error("not-your-game")
    }

    // TODO: check status of game

    if (game.board[rowIndex][pointIndex]) {
      throw new Meteor.Error("cell-taken")
    }

    let otherPlayer = game.currentPlayer === game.p1 ? game.p2 : game.p1
    let state = createEngineState(otherPlayer, game.currentPlayer,
        otherPlayer, game.board)
    state = state.move({
      row: rowIndex,
      col: pointIndex
    })

    if (!state) {
      return new Meteor.Error("invalid-move")
    }

    let board = state.getStringBoard()

    // TODO: check for full board ==> tie

    if (state.hasWinner()) {
      Games.update(gameId, {
        $set: {
          board,
          status: "winner",
        }
      })

      console.log(game.currentPlayer)
      Meteor.users.update(game.currentPlayer, { $inc: { won: 1 } })

      Meteor.users.update(otherPlayer, { $inc: { lost: 1 } })

      return
    } else {
      Games.update(game._id, {
        $set: {
          board,
          currentPlayer: otherPlayer,
        }
      });
    }

    // // if it's vs. AI, figure out the best move and then move there
    // game = Games.findOne(game._id)
    // if (game.currentPlayer === "AI") {
    //   let start = new Date().getTime()
    //   let bestMove = state.getBestMove()
    //   let end = new Date().getTime()
    //
    //   console.log(`took ${end - start}ms to generate best move: ` +
    //       `(${bestMove.row}, ${bestMove.col})`)
    //
    //   state = state.move(bestMove)
    //
    //   setBoard(gameId, state.getStringBoard())
    //
    //   if (state.hasWinner()) {
    //     playerWon(game)
    //     return
    //   }
    //
    //   playerMoved(game)
    // }
  }
})
