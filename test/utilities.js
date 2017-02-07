// import glob from 'glob'

// console.log(__dirname)
// const files = glob.sync("src/server#<{(||)}>#*.js")
// files.forEach(file => {
//   console.log(file)
//   require('../' + file)
// })

import {expect} from 'chai';
import Immutable from 'immutable'
import _ from 'underscore'
import { putPieceOnBoard } from '../src/both/utilities'

var emptyBoard = Immutable.fromJS([
  [ null, null, null, null, null ],
  [ null, null, null, null, null ],
  [ null, null, null, null, null ],
  [ null, null, null, null, null ],
  [ null, null, null, null, null ],
  [ null, null, null, null, null ],
])

var fullishBoard = Immutable.fromJS([
  [ null, null, null, null, null ],
  [ null, null, "FF", null, null ],
  [ null, null, null, null, null ],
  [ null, null, null, "FF", null ],
  [ null, "FF", null, null, null ],
  [ null, null, null, null, null ],
])

describe("Place piece on board", () => {
  let color = 'yop'

  // it("Place long-straight", () => {
  //   let newBoard = putPieceOnBoard(startBoard, {
  //     "type": "long-straight",
  //     color,
  //     "rotation": 0,
  //     "row": 0,
  //     "col": 0,
  //   })
  //
  //   newBoard.get(5).should.equal(startBoard.get(5))
  // })
})

describe('Check Sum', () => {
  it('1+1 == 2', () => {
    const res = 1 + 1
    res.should.equal(2)
  });

});

describe('placing on board', () => {

  describe('piece that is not in board area', () => {

    it('outside right', () => {
      const piece = Immutable.Map(
      {
        "type": "long-straight",
        "color": "FFFFFF",
        "rotation": 0,
        "row": 3,
        "col": 4,
      });
      const nextState = putPieceOnBoard(emptyBoard, piece);
      expect(nextState).to.equal(false);
    });

    it('outside left', () => {
      const piece = Immutable.Map(
      {
        "type": "long-straight",
        "color": "FFFFFF",
        "rotation": 3,
        "row": 1,
        "col": -2,
      });
      const nextState = putPieceOnBoard(emptyBoard, piece);
      expect(nextState).to.equal(false);
    });

    it('outside bottom', () => {
      const piece = Immutable.Map(
      {
        "type": "long-straight",
        "color": "FFFFFF",
        "rotation": 1,
        "row": 3,
        "col": 2,
      });
      const nextState = putPieceOnBoard(emptyBoard, piece);
      expect(nextState).to.equal(false);
    });
    // it('converts to immutable', () => {
    //   const state = Map();
    //   const entries = ['Trainspotting', '28 Days Later'];
    //   const nextState = setEntries(state, entries);
    //   expect(nextState).to.equal(Map({
    //     entries: List.of('Trainspotting', '28 Days Later')
    //   }));
    // });

  });

  describe('piece hits other in intersections', () => {
    it('in the middle', () => {
      const piece = Immutable.Map(
      {
        "type": "long-straight",
        "color": "FFFFFF",
        "rotation": 0,
        "row": 0,
        "col": 1,
      });
      const nextState = putPieceOnBoard(fullishBoard, piece);
      expect(nextState).to.equal(false);
    });
  });

  // describe('piece placed successfully', () => {
  //   it('in the middle', () => {
  //     const piece = Immutable.Map(
  //     {
  //       "type": "long-straight",
  //       "color": "YO",
  //       "rotation": 0,
  //       "row": 1,
  //       "col": 1,
  //     });
  //     const nextState = putPieceOnBoard(fullishBoard, piece);
  //
  //     // newly generated board
  //     expect(nextState).to.not.equal(false);
  //
  //     // but some of it is the same!
  //     expect(nextState.get(0)).to.equal(fullishBoard.get(0))
  //     expect(nextState.get(1)).to.equal(fullishBoard.get(1))
  //     expect(nextState.get(2)).to.not.equal(fullishBoard.get(2))
  //     expect(nextState.get(3)).to.equal(fullishBoard.get(3))
  //     expect(nextState.get(4)).to.equal(fullishBoard.get(4))
  //     expect(nextState.get(5)).to.equal(fullishBoard.get(5))
  //
  //     // the row that changed should be all good
  //     expect(_.isEqual([null, "YO", "YO", "YO", "YO"], nextState.get(2).toJS())).to.equal(true)
  //   });
  // });

});
