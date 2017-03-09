import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { pathFor } from '../../utilities/flow_helper.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class App extends Component {

  render() {
    return (
      <div>
        <div className="ui borderless menu">
          <div className="ui container">
            <a href={pathFor("home")} className="header item">
              Gomoku
            </a>

            <div className="right menu">
              <div className="item">
                <AccountsUIWrapper />
              </div>
            </div>
          </div>
        </div>

        <div className="ui container">
          {this.props.content}
        </div>
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
