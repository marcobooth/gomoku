import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { pathFor } from '../utilities/flow_helper.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

export default class App extends Component {

  render() {
    return (
      <div>
        <div className="ui borderless inverted fixed menu">
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

        {this.props.content}
      </div>
    );
  }
}
