import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Games } from '../api/collections.js';
import Board from './Board.jsx'
import GameInfo from './GameInfo.jsx'
import PieceColour from './PieceColour.jsx'
import GameMessages from './GameMessages.jsx'

class Game extends Component {

  render() {
    if (!this.props.loaded) {
      return <div><button className="ui loading button"></button>Loading...</div>
    }

    // let game, status, currentUser = { this.props... }
    if (!this.props.game) {
      return <div>Invalid game!</div>
    }

    let { currentUser, game } = this.props

    let readonly
    let spectatorMode = false
    if (!currentUser || (game.p1 !== currentUser._id && game.p2 !== currentUser._id)) {
      spectatorMode = true
      readonly = true
    } else {
      // checks if game has started, is over, or if this player has the current turn
      readonly = game.status === "creating" || game.status === "winner" || (currentUser._id != game.currentPlayer)
    }


    let gameOver
    if (game.status === "winner") {
      if (Meteor.user()._id === game.winner) {
        gameOver = <div className="boldText">You won!</div>
      } else if (Meteor.user()._id === game.p1 || Meteor.user()._id === game.p2) {
        gameOver = <div className="boldText">You lost!</div>
      } else {
        gameOver = <div className="boldText">Game Over!</div>
      }
    }

    return (
      <div className="ui container spaceHeader">
        <div className="ui very relaxed stackable grid">
          <div className="centered row">
            {gameOver}
          </div>
          <div className="row">
            <div className="eight wide column">
              <Board game={this.props.game} readonly={readonly} />
            </div>
            <div className="eight wide column">
              <h2 className="center">Game Information</h2>
              <GameInfo game={this.props.game} spectatorMode={spectatorMode} readonly={readonly} currentUser={this.props.currentUser} />
              <PieceColour game={this.props.game} currentUser={this.props.currentUser} />
              <GameMessages />
            </div>
          </div>
        </div>
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
  let fetchGame = Meteor.subscribe('game', gameId)
  return {
    loaded: fetchGame.ready(),
    game: Games.findOne(gameId),
    currentUser: Meteor.user(),
  };
}, Game);
