import React from "react";
import { shallow } from "enzyme";
import App from '../src/client/containers/app';
import {expect} from 'chai';
import Immutable from 'immutable';

describe("App", () => {

  it("should have an image", () => {
    let props = []
    const wrapper = shallow(
      <App {...props}/>
    );

    expect(wrapper.find('img').length).to.equal(1);
  });


});
