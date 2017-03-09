import { Games, Messages } from '../collections.js'
import { check } from 'meteor/check';

Meteor.publish('highScoreData', function () {
  return Meteor.users.find({}, { fields: { username: 'true', 'won' : true, 'drawn': true, 'lost': true }})
})

Meteor.publish('gameData', function () {
  return Games.find({})
})

Meteor.publish('messageData', function (gameId) {
  check(gameId, String);

  return Messages.find({ gameId })
})
