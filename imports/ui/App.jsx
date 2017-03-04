import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { pathFor } from '../../utilities/flow_helper.js';
import { Boards } from '../api/boards.js';

class App extends Component {

  handleClick() {
    Meteor.call('boards.insert', [['green', 'grey', 'grey'], ['blue', 'grey', 'grey']]);
    console.log("I have been clicked");
  }

  renderBoardIds() {
    return this.props.boards.map((board) => {
      return (<li><a href={ pathFor( '/boards/:id', { id: board._id }) }> {board._id}</a></li>);
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Gomoku Board</h1>
        </header>

        <button onClick={this.handleClick.bind(this)}>
          Create a board!
        </button>

        <ul>
          {this.renderBoardIds()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
};

export default createContainer(() => {

  return {
    boards: Boards.find({}).fetch(),
  };
}, App);
