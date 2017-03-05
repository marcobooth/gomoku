import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { pathFor } from '../../utilities/flow_helper.js';
import { Games } from '../api/games.js';

class Home extends Component {

  handleClick(typeGame) {
    Meteor.call('games.insert', typeGame, (error, _id) => {
      if (error) {
        console.log("making a new game error:", error)
      }
      if (_id) {
        FlowRouter.go('Games.show', { _id });
      }
      // console.log("gameId:", gameId)
    });
    // console.log("I have been clicked")
  }

  renderBoardIds() {
    return this.props.boards.map((board) => {
      return (<li><a href={ pathFor( '/boards/:id', { id: board._id }) }> {board._id}</a></li>);
    });
  }

  render() {
    return (
      <div className="container">
        <button onClick={this.handleClick.bind(this, "player")}>
          1 v 1
        </button>

        <button onClick={this.handleClick.bind(this, "AI")}>
          1 v AI
        </button>
      </div>
    );
  }
}

Home.propTypes = {
};

export default createContainer(() => {

  return {
    games: Games.find({}).fetch(),
  };
}, Home);
