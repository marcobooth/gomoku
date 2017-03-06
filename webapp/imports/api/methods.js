import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from './collections.js'

Meteor.methods({
  'games.insert'(typeGame) {
    // check(text, String);
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    let board = [[undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined]]

    if (typeGame === 'AI') {
      return Games.insert({
        board: board,
        currentPlayer: this.userId,
        p1: this.userId,
        p2: 'AI',
        p1Colour: 'red',
        p2Colour: 'black',
        status: 'started',
        winner: undefined
      })
    } else {
      Games.insert({
        board: board,
        currentPlayer: this.userId,
        p1: this.userId,
        p2: undefined,
        status: 'creating',
        winner: undefined
      })
    }
  },
})
