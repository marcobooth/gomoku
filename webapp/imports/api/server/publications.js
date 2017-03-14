import { Games, Messages } from '../collections.js'
import { check } from 'meteor/check';

Meteor.publish('highScoreData', function () {
  return Meteor.users.find({}, { fields: { username: 'true', 'won' : true, 'drawn': true, 'lost': true }})
})

Meteor.publish('game', function (gameId) {
  check(gameId, String);
  return Games.find(gameId)
})

Meteor.publish('listGames', function (status, limit) {
  check(status, String)
  check(limit, Number)

  return Games.find({
    status
  }, {
    fields: {
      status: true, p1: true, p2: true, p1Username: true, p2Username: true
    },
    limit
  })
})

Meteor.publish('messages', function (gameId) {
  check(gameId, String);
  return Messages.find({ gameId })
})
