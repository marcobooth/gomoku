import { Games, Messages } from '../collections.js'
import { check } from 'meteor/check';
import { ensureLoggedIn } from '../../utilities/ensureLoggedIn.js'

Meteor.publish('highScoreData', function () {
  return Meteor.users.find({}, { fields: { username: 'true', won : true, drawn: true, lost: true }})
})

Meteor.publish('game', function (gameId) {
  check(gameId, String)
  return Games.find(gameId)
})

Meteor.publish('listGames', function (status, limit) {
  check(status, String)
  check(limit, Number)

  return Games.find({
    status
  }, {
    fields: {
      status: true, p1: true, p2: true, p1Username: true, p2Username: true, winner: true, winnerMoves: true
    },
    limit
  })
})

Meteor.publish('messages', function (gameId) {
  check(gameId, String);
  ensureLoggedIn(this.userId)
  return Messages.find({ gameId })
})
