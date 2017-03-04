// import { Meteor } from 'meteor/meteor';
// import { render } from 'react-dom';
// import { renderRoutes } from '../imports/startup/routes.js';
//
// Meteor.startup(() => {
//   render(renderRoutes(), document.getElementById('render-target'));
// });

import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import AppContainer from '../imports/ui/App.jsx';
import BoardContainer from '../imports/ui//Board.jsx';

FlowRouter.route("/", {
  action() {
    mount(AppContainer);
  }
});

FlowRouter.route('/boards/:id', {
  name: 'Boards.show',
  action() {
    mount(BoardContainer);
  },
});
