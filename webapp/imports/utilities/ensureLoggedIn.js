export function ensureLoggedIn(userId) {
  if (! userId) {
    throw new Meteor.Error('not-logged-in');
  }
}
