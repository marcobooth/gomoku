import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser(function (options, user) {
  user.won = 0
  user.lost = 0
  user.drawn = 0

  return user
})
