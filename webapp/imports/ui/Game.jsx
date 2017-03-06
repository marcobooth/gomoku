import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Games } from '../api/collections.js';
import Board from './Board.jsx'
import JoinGame from './JoinGame.jsx'

class Game extends Component {

  handleJoinGame() {
    Meteor.call('games.join', this.props.game._id);
  }

  joinGameButton() {
    return <div onClick={this.handleJoinGame.bind(this)}>Click me!</div>
  }

  render() {
    // let game, status, currentUser = { this.props... }
    if (!this.props.game) {
      return <div></div>
    }
    if (this.props.game.status === "creating") {
      return <JoinGame game={this.props.game} currentUser={this.props.currentUser} />
    }
    else if (this.props.game.status === "winner") {
      return <div>Somebody won the game!!</div>
    }

    return (
      <div className="container">
        <h2>
          Gomoku - Da Game
        </h2>
        <div>
          <Board game={this.props.game} currentUser={this.props.currentUser} />
        </div>
      </div>
    );
  }
}

Game.propTypes = {
};

export default createContainer(( params ) => {
  gameId = FlowRouter.getParam("_id")
  return {
    game: Games.findOne(gameId),
    currentUser: Meteor.user(),
  };
}, Game);
