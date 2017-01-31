// import glob from 'glob'

// console.log(__dirname)
// const files = glob.sync("src/server#<{(||)}>#*.js")
// files.forEach(file => {
//   console.log(file)
//   require('../' + file)
// })

import chai from "chai"
import Immutable from 'immutable'

chai.should()

var fill = 'FFFFFF'

var startBoard = Immutable.fromJS([
  [ null, null, null, null, null ],
  [ null, null, null, null, null ],
  [ null, null, null, null, null ],
  [ null, null, null, null, null ],
  [ null, null, null, null, null ],
  [ null, null, null, null, null ],
]);

describe("Place piece on board", () => {
  it("Place long-straight", () => {
    return true;
  });
})

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
