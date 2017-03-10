import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Users } from '../api/collections.js';
import tablesort from '../jquery/tablesort.js'

class HighScores extends Component {

  renderHighScoreRows() {
    return renderedRows = this.props.users.map((user, index) => {
      return (
        <tr key={index}>
          <td>{user.username}</td>
          <td>{user.won ? user.won : 0}</td>
          <td>{user.lost ? user.lost : 0}</td>
          <td>{user.drawn ? user.drawn : 0}</td>
        </tr>
      )
    })
  }

  componentDidMount() {
    $('table').tablesort()
  }

  render() {
    return (
      <div className="highscores">
        <h1 className="center">High Scores</h1>
        <table className="ui sortable celled table">
          <thead>
            <tr>
              <th className="sorted descending">Username</th>
              <th className="">Won</th>
              <th className="">Lost</th>
              <th className="">Drawn</th>
            </tr>
          </thead>
          <tbody>
            {this.renderHighScoreRows()}
          </tbody>
        </table>
      </div>
    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('highScoreData')

  return {
    users: Meteor.users.find().fetch(),
  };
}, HighScores);
