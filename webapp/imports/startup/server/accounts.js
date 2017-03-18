import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser(function (options, user) {
  user.won = 0
  user.lost = 0
  user.drawn = 0

  return user
})

// insert the AI user if it doesn't exist
Meteor.users.upsert({ _id: "AI" }, {
  $set: {
    username: "HAL 9000",
    won: 0,
    lost: 0,
    drawn: 0
  }
})
