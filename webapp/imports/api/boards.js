import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Boards = new Mongo.Collection('boards');


Meteor.methods({
  'boards.insert'(board) {

    Boards.insert({
      board,
      createdAt: new Date(),
    });
  },
  'boards.changePieceColour'(boardId, location, colour) {
    // check(boardId, String);
    // check(setChecked, Boolean);
    const board = Boards.findOne(boardId);
    // Boards.update(boardId, {
    //   $set: {
    //     [`board.${location[0]}.${location[1]}`]: colour
    //   }
    // });
  },
})
