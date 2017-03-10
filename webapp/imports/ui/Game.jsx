import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Games } from '../api/collections.js';
import Board from './Board.jsx'
import PieceColour from './PieceColour.jsx'
import GameMessages from './GameMessages.jsx'

class Game extends Component {

  render() {
    if (!this.props.subscription.ready()) {
      return <div><button className="ui loading button"></button>Loading...</div>
    }

    // let game, status, currentUser = { this.props... }
    if (!this.props.game) {
      return <div>Invalid game!</div>
    }
    if (this.props.game.status === "winner") {
      var winner = <div>Somebody won the game!!</div>
    }

    return (
      <div className="container">
        { winner }
        <div>
          <PieceColour game={this.props.game} currentUser={this.props.currentUser} />
          <Board game={this.props.game} currentUser={this.props.currentUser} />
        </div>
        <GameMessages />
      </div>
    );
  }
}

Game.propTypes = {
  game: React.PropTypes.object,
  currentUser: React.PropTypes.object
}

export default createContainer(( params ) => {
  let gameId = FlowRouter.getParam("_id")

  return {
    subscription: Meteor.subscribe('gameData', gameId),
    game: Games.findOne(gameId),
    currentUser: Meteor.user(),
  };
}, Game);
