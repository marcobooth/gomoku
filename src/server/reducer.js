import {
  callChildProcess,
  INITIAL_STATE,
} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  console.log("hillo");
  // TODO change state to pending while in child process
  callChildProcess(state)
    .then((value) => {
      console.log("action:", action)
    })
    .catch((reason) => {
      console.log('Handle rejected promise ('+reason+') here.');
    });
    // switch (action.type) {
    //   case 'PLACE_PIECE':
    //     return callChildProcess(state)
    // }
  return state;
}
