import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Games } from '../api/collections.js';

class Game extends Component {

  handleGameMove(rowIndex, pointIndex) {
    Meteor.call('games.handleMove', this.props.game._id, rowIndex, pointIndex);
  }

  handleJoinGame() {
    Meteor.call('games.join', this.props.game._id);
  }

  joinGameButton() {
    return <div onClick={this.handleJoinGame.bind(this)}>Click me!</div>
  }

  renderBoard() {
    var renderedBoard = this.props.game.board.map((row, rowIndex) => {
      return <div className="row" key={rowIndex} style={{display: 'flex'}}>
        {row.map((point, pointIndex) => {
          if (point === null) {
            var currentPointColour = "grey"
          }
          else if (point === this.props.game.p1) {
            var currentPointColour = this.props.game.p1Colour
          }
          else {
            var currentPointColour = this.props.game.p2Colour
          }
          return <div className="dot"
                      key={pointIndex}
                      style={{background: currentPointColour}}
                      onClick={this.handleGameMove.bind(this, rowIndex, pointIndex)}>
                </div>
        })}
      </div>
    });
    return renderedBoard;
  }

  render() {
    // let game, status, currentUser = { this.props... }
    if (!this.props.game) {
      return <div></div>
    }
    // console.log("this.props.game:", this.props.game)
    if (this.props.game.status === "creating") {
      console.log("this.props:", this.props)
      if (this.props.currentUser && this.props.currentUser._id === this.props.game.p1) {
        return <div>Waiting for another player</div>
      } else if (this.props.currentUser && this.props.currentUser._id) {
        return <div>{this.joinGameButton()}</div>
      } else {
        return <div>Please login to join a game</div>
      }
    } else if (this.props.game.status === "winner") {
      return <div>Somebody won the game!!</div>
    }

    return (
      <div className="container">
        <h2>
          Gomoku - Da Game
        </h2>
        <div>
          {this.renderBoard()}
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
