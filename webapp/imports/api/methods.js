import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games, Messages } from './collections.js'
import { ensureLoggedIn } from '../utilities/ensureLoggedIn.js'

Meteor.methods({
  'games.insert'(isAI) {
    check(isAI, Boolean)

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    let board = [[undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined]]

    if (isAI === true) {
      return Games.insert({
        board: board,
        currentPlayer: this.userId,
        p1: this.userId,
        p2: 'AI',
        status: 'started',
      })
    } else {
      return Games.insert({
        board: board,
        currentPlayer: this.userId,
        p1: this.userId,
        p2: undefined,
        status: 'creating',
      })
    }
  },
  'games.join'(gameId) {
    check(gameId, String)

    ensureLoggedIn.bind(this)

    Games.update({
      _id: gameId,
      status: 'creating'
    }, {
      $set: {
        p2: this.userId,
        status: 'started'
      }
    })
  },
  'games.changePieceColour'(gameId, userId, colour) {
    check(gameId, String)
    check(userId, String)
    check(colour, String)

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
    check(gameId, String);
    check(text, String);

    ensureLoggedIn.bind(this)

    return Messages.insert({
      text,
      gameId,
      username: Meteor.user().username,
    })
  },
})
