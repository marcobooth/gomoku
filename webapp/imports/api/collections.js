import { Mongo } from 'meteor/mongo';

export const Games = new Mongo.Collection('games');

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
