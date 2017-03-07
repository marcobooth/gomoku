import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games, Messages } from './collections.js'

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
      return Games.insert({
        board: board,
        currentPlayer: this.userId,
        p1: this.userId,
        p2: undefined,
        p1Colour: 'red',
        p2Colour: 'black',
        status: 'creating',
        winner: undefined
      })
    }
  },
  'games.join'(gameId) {
    const game = Games.findOne(gameId);
    Games.update(gameId, { $set: { p2: this.userId, status: 'started' }});
  },
  'games.changePieceColour'(gameId, userId, colour) {
    const game = Games.findOne(gameId);

    let playerToChange
    if (userId === game.p1) {
      playerToChange = "p1Colour"
    } else {
      playerToChange = "p2Colour"
    }

    Games.update(gameId, { $set: { [playerToChange] : colour }});
  },
  'messages.insert'(gameId, text) {
    check(text, String);
    check(gameId, String);

    console.log("About to add a message");

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Messages.insert({
      text,
      gameId,
      userId: this.userId,
      dateCreated: new Date
    })
  },
})
