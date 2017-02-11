import React from "react";
import { shallow } from "enzyme";
import { Messages } from '../src/client/containers/messages';
import {expect} from 'chai';
import Immutable from 'immutable';

describe("Messages", () => {
  let props;
  let mountedMessagesScreen;
  const messagesScreen = () => {
    if (!mountedMessagesScreen) {
      mountedMessagesScreen = mount(
        <Messages {...props} />
      );
    }
    return mountedMessagesScreen;
  }

  beforeEach(() => {
    props = {
      messages: Immutable.fromJS([
        {
          username: "tfleming",
          message: "hello there",
          date: "10/07/2018",
        }
      ]),
      params: {username: 'marco', roomName: '42'},
    }
    mountedMessagesScreen = undefined;
  })

  describe("the rendered div", () => {

    it("no message to render", () => {
      props.messages = []
      const wrapper = shallow(
        <Messages {...props} />
       );
       expect(wrapper.find('.date_username').length).to.equal(0);
    });

    it("contains everything else that gets rendered", () => {
      const wrapper = shallow(
        <Messages {...props} />
       );
       expect(wrapper.find('.date_username').length).to.equal(2);
    });
  });

});
