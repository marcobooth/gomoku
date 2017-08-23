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

Meteor.publish('watchableGames', function (limit) {
  check(limit, Number)

  return Games.find({
    status: 'started',
    p1: { $ne: this.userId },
    p2: { $ne: this.userId },
  }, {
    fields: {
      status: true, p1: true, p2: true, p1Username: true, p2Username: true
    },
    limit
  })
})

Meteor.publish('myGames', function (limit) {
  check(limit, Number)

  return Games.find({
    status: 'started',
    $or: [
      { p1: this.userId },
      { p2: this.userId },
    ],
  }, {
    fields: {
      status: true, p1: true, p2: true, p1Username: true, p2Username: true
    },
    limit
  })
})

Meteor.publish('joinableGames', function (limit) {
  check(limit, Number)

  return Games.find({
    status: 'creating'
  }, {
    fields: {
      status: true, p1: true, p2: true, p1Username: true, p2Username: true
    },
    limit
  })
})



Meteor.publish('messages', function (gameId) {
  check(gameId, String);
  ensureLoggedIn(this.userId)
  return Messages.find({ gameId })
})
