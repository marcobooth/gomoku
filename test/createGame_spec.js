import React from "react";
import { shallow } from "enzyme";
import { CreateGame } from '../src/client/containers/createGame';
import {expect} from 'chai';
import Immutable from 'immutable';

describe("createGame", () => {
  let props;
  let mountedCreateGameScreen;
  const createGameScreen = () => {
    if (!mountedCreateGameScreen) {
      mountedCreateGameScreen = shallow(
        <CreateGame {...props} />
      );
    }
    return mountedCreateGameScreen;
  }

  beforeEach(() => {
    props = {
      params: {username: 'marco', roomName: '42'},
    }
    mountedCreateGameScreen = undefined;
  })

  describe("rendered game", () => {

    it("with nothing to render", () => {
      const wrapper = createGameScreen()
      expect(wrapper.find('div').length).to.equal(1);
    });

    it("no games", () => {
      props.games = Immutable.fromJS({})
      const wrapper = createGameScreen()
      expect(wrapper.find('div').length).to.equal(1);
    });

    it("two games", () => {
      props.games = Immutable.fromJS({
          42: {
            game: {
              masterUsername: 'tfleming'
            },
            clients: {
              'tfleming': {
                score: 0
              }
            }
          },
          2910: {
            game: {
              masterUsername: 'mbooth'
            },
            clients: {
              'tfleming': {
                score: 100
              }
            }
          }
        })
      const wrapper = createGameScreen()
      expect(wrapper.find('li').length).to.equal(2);
    });

  });

});
