import { Mongo } from 'meteor/mongo';

export const Games = new Mongo.Collection('games')

// ONLY FOR TESTING, REMOVE THIS LINE. Well I probably should, it's a global variable..
Collections = { Games, Messages }

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
    optional: true
  },
  p2Colour: {
    type: String,
    optional: true
  },
  status: {
    type: String
  },
  winner: {
    type: String,
    optional: true
  },
}));

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
    optional: true
  },
  dateCreated: {
    type: Date,
    optional: true
  },
}));
