export function ensureLoggedIn() {
  console.log("this.userId:", this.userId)
  if (! this.userId) {
    throw new Meteor.Error('not-logged-in');
  }
}
