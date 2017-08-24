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
    },
    $inc: {
      movesTaken: 1
    }
  })
}

function playerWon(game, winningThreat, userGaveUp) {
  let winningPlayer
  let losingPlayer
  if (winningThreat === null && userGaveUp === game.p1) {
    winningPlayer = game.p2
    losingPlayer = game.p1
  } else if (winningThreat === null && userGaveUp === game.p2) {
    winningPlayer = game.p1
    losingPlayer = game.p2
  } else if (game.currentPlayer === game.p1) {
    winningPlayer = game.p1
    losingPlayer = game.p2
  } else {
    winningPlayer = game.p2
    losingPlayer = game.p1
  }

  let winningMoves
  if (winningThreat !== null) {
    winningMoves = winningThreat.played.map(function(threat) {
        return [threat["row"], threat["col"]]
    })
  }

  Games.update(game._id, {
    $set: {
      status: "winner",
      winner: winningPlayer,
      winningMoves
    }
  })

  Meteor.users.update(winningPlayer, {
    $inc: {
      won: 1
    }
  })

  Meteor.users.update(losingPlayer, {
    $inc: {
      lost: 1
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
      return new Meteor.Error("invalid-move")
    }

    setBoard(gameId, state.getStringBoard())

    if (state.hasWinner()) {
      playerWon(game, state.getWinningThreat(), null)
      return
    }

    playerMoved(game)

    // if it's vs. AI, figure out the best move and then move there
    game = Games.findOne(game._id)
    if (game.currentPlayer === "AI") {
      bestMove = state.getBestMove()

      state = state.move(bestMove)

      setBoard(gameId, state.getStringBoard())

      if (state.hasWinner()) {
        playerWon(game)
        return
      }

      playerMoved(game)
    }
  },
  'games.giveUp'(gameId, userId) {
    check(gameId, String)
    check(userId, String)

    let game = Games.findOne(gameId)
    playerWon(game, null, userId)
  }
})
