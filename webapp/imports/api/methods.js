import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games, Messages } from './collections.js'
import { ensureLoggedIn } from '../utilities/ensureLoggedIn.js'
import _ from 'underscore'

Meteor.methods({
  'games.insert'(isAI) {
    check(isAI, Boolean)

    ensureLoggedIn(this.userId)

    let board = []
    for (let i = 0; i < 19; i++) {
      board.push([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined])
    }
    let user = Meteor.user()

    let newBoard = {
      board: board,
      currentPlayer: user._id,
      p1: user._id,
      p1Username: user.username,
      status: 'started'
    }

    if (isAI === true) {
      _.extend(newBoard, { p2: 'AI', p2Username: 'AI', status: 'started' })
    } else {
      _.extend(newBoard, { status: 'creating' })
    }
    return Games.insert(newBoard)
  },
  'games.join'(gameId) {
    check(gameId, String)

    ensureLoggedIn(this.userId)

    let user = Meteor.user()

    Games.update({
      _id: gameId,
      status: 'creating'
    }, {
      $set: {
        p2: user._id,
        p2Username: user.username,
        status: 'started'
      }
    })
  },
  'games.changePieceColour'(gameId, userId, colour) {
    check(gameId, String)
    check(userId, String)
    check(colour, String)

    ensureLoggedIn(this.userId)
    const game = Games.findOne(gameId)

    let playerToChange
    if (userId === game.p1) {
      playerToChange = "p1Colour"
    } else if (userId === game.p2) {
      playerToChange = "p2Colour"
    } else {
      console.log("This should not have been called")
      return
    }

    Games.update(gameId, { $set: { [playerToChange] : colour }})
  },
  'messages.insert'(gameId, text) {
    check(gameId, String);
    check(text, String);

    ensureLoggedIn(this.userId)

    return Messages.insert({
      text,
      gameId,
      username: Meteor.user().username,
    })
  },
})
