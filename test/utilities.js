// import glob from 'glob'

// console.log(__dirname)
// const files = glob.sync("src/server#<{(||)}>#*.js")
// files.forEach(file => {
//   console.log(file)
//   require('../' + file)
// })

import chai from "chai"
import Immutable from 'immutable'
import _ from 'underscore'
import { pieces } from '../src/both/pieces'
import { putPieceOnBoard } from '../src/both/utility'

chai.should()

var fill = 'FFFFFF'

var startBoard = Immutable.fromJS([
  [ null, null, null, null, null ],
  [ null, null, null, null, null ],
  [ null, null, null, "FF", null ],
  [ null, null, null, "FF", null ],
  [ null, null, null, "FF", null ],
  [ null, null, null, null, null ],
])

describe("Place piece on board", () => {
  let color = 'yop'

  it("Place long-straight", () => {
    let newBoard = putPieceOnBoard(startBoard, {
      "type": "long-straight",
      color,
      "rotation": 0,
      "row": 0,
      "col": 0,
    })

    newBoard.get(5).should.equal(startBoard.get(5))
  })
})

describe('Check Sum', () => {
  it('1+1 == 2', () => {
    const res = 1 + 1
    res.should.equal(2)
  });

});


// describe('Fake redux test', function(){
//   it('alert it', function(done){
//     const initialState = {}
//     const store =  configureStore(rootReducer, null, initialState, {
//       ALERT_POP: ({dispatch, getState}) =>  {
//         const state = getState()
//         state.message.should.equal(MESSAGE)
//         done()
//       }
//     })
//     store.dispatch(alert(MESSAGE))
//   });
//
// });
