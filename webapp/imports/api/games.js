import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Games = new Mongo.Collection('games');

Games.attachSchema(new SimpleSchema({
  // can't declare Array straight, must specify what the value will be
  board: {
    type: [[String]]
  },
  currentPlayer: {
    type: String
  },
  p1: {
    type: String
  },
  p2: {
    type: String,
    optional: true
  },
  p1Colour: {
    type: String,
    optional: true
  },
  p2Colour: {
    type: String,
    optional: true
  },
  status: {
    type: String
  },
  winner: {
    type: String,
    optional: true
  },
}));

Meteor.methods({
  'games.insert'(typeGame) {
    // check(text, String);
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    let board = [[undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined]]

    if (typeGame === 'AI') {
      return Games.insert({
        board: board,
        currentPlayer: this.userId,
        p1: this.userId,
        p2: 'AI',
        p1Colour: 'red',
        p2Colour: 'black',
        status: 'started',
        winner: undefined
      })
    } else {
      Games.insert({
        board: board,
        currentPlayer: this.userId,
        p1: this.userId,
        p2: undefined,
        status: 'creating',
        winner: undefined
      })
    }
  },
  'games.handleMove'(gameId, rowIndex, pointIndex) {
    check(gameId, String);
    check(rowIndex, Number);
    check(pointIndex, Number);
    const game = Games.findOne(gameId);
    console.log("game:", game)
    if (game.board[rowIndex][pointIndex] === null) {
      let newGameArray = game.board
      newGameArray[rowIndex][pointIndex] = game.currentPlayer
      let currentPlayer = game.currentPlayer === game.p1 ? game.p2 : game.p1
      Games.update(gameId, { $set: { board: newGameArray, currentPlayer: currentPlayer }});
    } else {
      console.log("point has already been taken");
    }


  }
})
