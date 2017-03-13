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

    if (!game.board[rowIndex][pointIndex]) {
      // send it to the python script.
      // v Player - invalid move, valid move, winner
      exec("python ../../../../../../test.py", Meteor.bindEnvironment(function(error, stdout, stderr) {
        if (error) {
          console.log("error");
        }
        else if (stdout === "winner\n") {
          p1 = Meteor.users.findOne({ "_id" : game.p1 })

          Meteor.users.update(game.p1, {
            $inc: {
              won: 1
            }
          })

          Games.update(gameId, {
            $set: {
              status: "winner"
            }
          })
        } else if (stdout === "validmove\n") {
          console.log("I'm in the valid move");
          let nextPlayer = game.currentPlayer === game.p1 ? game.p2 : game.p1
          Games.update(gameId, {
            $set: {
              [`board.${rowIndex}.${pointIndex}`]: game.currentPlayer,
              currentPlayer: nextPlayer
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
