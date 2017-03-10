import { Games, Messages } from '../collections.js'
import { check } from 'meteor/check';

Meteor.publish('highScoreData', function () {
  return Meteor.users.find({}, { fields: { username: 'true', 'won' : true, 'drawn': true, 'lost': true }})
})

Meteor.publish('gameData', function (gameId) {
  check(gameId, String);

  return Games.find(gameId)
})

Meteor.publish('gamesData', function () {
  return Games.find({}, { fields: { status: true }})
})

Meteor.publish('messageData', function (gameId) {
  console.log("gameId:", gameId)
  check(gameId, String);

  return Messages.find({ gameId })
})
