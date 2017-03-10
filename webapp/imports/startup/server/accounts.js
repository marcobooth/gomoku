import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser(function (options, user) {
  user.won = 0
  user.lost = 0
  user.drawn = 0

  // TODO ask Teo about this 
  // We still want the default hook's 'profile' behavior.
  // if (options.profile) {
  //   user.profile = options.profile;
  // }

  return user
})
