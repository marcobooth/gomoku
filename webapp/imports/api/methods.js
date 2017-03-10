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
    let board = []
    for (let i = 0; i < 19; i++) {
      board.push([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined])
    }
    let user = Meteor.user()

    if (isAI === true) {
      return Games.insert({
        board: board,
        currentPlayer: user._id,
        p1: user._id,
        p1Username: user.username,
        p2: 'AI',
        p2Username: 'AI',
        status: 'started',
      })
    } else {
      return Games.insert({
        board: board,
        currentPlayer: user._id,
        p1: user._id,
        p1Username: user.username,
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

    ensureLoggedIn.bind(this)
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
