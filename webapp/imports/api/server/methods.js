import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '../collections.js'
const { exec } = require('child_process');

Meteor.methods({
  'games.handleMove'(gameId, rowIndex, pointIndex) {
    check(gameId, String);
    check(rowIndex, Number);
    check(pointIndex, Number);

    const game = Games.findOne(gameId);
    // console.log("game:", game)
    // set an updating attribute, only allow one thing at a time

    if (game.board[rowIndex][pointIndex] === null) {
      // send it to the python script.
      // v Player - invalid move, valid move, winner
      exec("python ../../../../../../test.py", Meteor.bindEnvironment(function(error, stdout, stderr) {
        if (error) {
          console.log("error");
        }
        else if (stdout === "winner\n") {
          p1 = Meteor.users.findOne({ "_id" : game.p1 })
          let gamesWon = p1.won ? p1.won + 1 : 1

          Meteor.users.update(game.p1, {
            $set: {
              won: gamesWon
            }
          })

          Games.update(gameId, {
            $set: {
              status: "winner"
            }
          })
        } else if (stdout === "validmove\n") {
          console.log("I'm in the valid move");
          console.log("game:", game)
          let newGameArray = game.board
          newGameArray[rowIndex][pointIndex] = game.currentPlayer
          let currentPlayer = game.currentPlayer === game.p1 ? game.p2 : game.p1
          // TODO ask flenge how to add to part of the array
          Games.update(gameId, {
            $set: {
              board: newGameArray,
              currentPlayer: currentPlayer
            }
          });
        } else {
          console.log("In the other");
          console.log("stdout:", stdout)
          console.log("stdout === winner:", stdout == "winner")
          // TODO ask flenge how to send error to client
          throw new Meteor.Error("create-failed");
        }
      }))
    } else {
      console.log("point has already been taken");
    }
  }
})
