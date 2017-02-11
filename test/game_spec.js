import React from "react";
import { shallow } from "enzyme";
import { Game } from '../src/client/containers/game';
import {expect} from 'chai';
import Immutable from 'immutable';

describe("GameScreen", () => {
  let props;
  let mountedGameScreen;
  const gameScreen = () => {
    if (!mountedGameScreen) {
      mountedGameScreen = mount(
        <Game {...props} />
      );
    }
    return mountedGameScreen;
  }

  beforeEach(() => {
    props = {
      alreadyStarted: true,
      masterUsername: "marco",
      currentPiece: Immutable.fromJS({
        type: "square",
        rotation: 3,
        row: -2,
        col: 1,
      }),
      winnerState: false,
      board: Immutable.fromJS([
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null, null, null, null ],
      ]),
      score: 0,
      joined: true,
      connected: true,
      otherBoards: Immutable.fromJS({ "marco": [null]}),
      params: {username: 'marco'},
    }
    mountedGameScreen = undefined;
  })

  describe("the rendered div", () => {
    it("renders next to nothing", () => {
      props.alreadyStarted = false
      const wrapper = shallow(<Game {...props} />)
      expect(wrapper.find('.title').length).to.not.equal(2);
    })


    it("contains everything else that gets rendered", () => {
      const wrapper = shallow(
        <Game {...props} />
       );
       wrapper.find('h3').simulate('click');
       expect(wrapper.find('.title').length).to.equal(2);
      // When using .find, enzyme arranges the nodes in order such
      // that the outermost node is first in the list. So we can
      // use .first() to get the outermost div.
      // const wrappingDiv = divs.first();

      // Enzyme omits the outermost node when using the .children()
      // method on lockScreen(). This is annoying, but we can use it
      // to verify that wrappingDiv contains everything else this
      // component renders.
      // expect(wrappingDiv.children()).toEqual(messageScreen().children());
    });
  });

  // All tests will go here
});
