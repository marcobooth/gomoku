import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { pathFor } from '../../utilities/flow_helper.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class App extends Component {

  render() {
    return (
      <div className="container">
        <header>
          <a href={ pathFor( '/' ) }>
            <h1>Gomoku</h1>
          </a>
        </header>
        <AccountsUIWrapper />
        {this.props.content}
      </div>
    );
  }
}

App.propTypes = {
};

export default createContainer(() => {

  return {
  };
}, App);
