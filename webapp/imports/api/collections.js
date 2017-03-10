import { Mongo } from 'meteor/mongo';

export const Games = new Mongo.Collection('games')

dateCreatedAutoValue = function () {
  if (this.isInsert) {
    return new Date();
  } else if (this.isUpsert) {
    return { $setOnInsert: new Date() };
  } else {
    this.unset();  // Prevent user from supplying their own value
  }
}

Games.attachSchema(new SimpleSchema({
  // can't declare Array straight, must specify what the value will be
  board: {
    type: [[String]]
  },
  currentPlayer: {
    type: String
  },
  p1: {
    type: String
  },
  p2: {
    type: String,
    optional: true
  },
  p1Colour: {
    type: String,
    defaultValue: 'red'
  },
  p2Colour: {
    type: String,
    defaultValue: 'blue'
  },
  status: {
    type: String
  },
  winner: {
    type: String,
    optional: true
  },
}))

export const Messages = new Mongo.Collection('messages');

Messages.attachSchema(new SimpleSchema({
  text: {
    type: String
  },
  gameId: {
    type: String
  },
  username: {
    type: String,
  },
  dateCreated: {
    type: Date,
    autoValue: dateCreatedAutoValue
  },
}))

// ONLY FOR TESTING, REMOVE THIS LINE. Well I probably should, it's a global variable..
Collections = { Games, Messages }
