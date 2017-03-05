import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import AppContainer from '../imports/ui/App.jsx';
import HomeContainer from '../imports/ui/Home.jsx';
import GameContainer from '../imports/ui/Game.jsx';

FlowRouter.route("/", {
  action() {
    mount(AppContainer, {
      content: <HomeContainer />
    })
  }
});

FlowRouter.route('/games/:_id', {
  name: 'Games.show',
  action() {
    mount(AppContainer, {
      content: <GameContainer />
    })
  }
})
