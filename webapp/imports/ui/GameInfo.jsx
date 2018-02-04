import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class GameInfo extends Component {

  handleJoinGame() {
    Meteor.call('games.join', this.props.game._id);
  }

  renderCurrentTurn(readonly) {
    if (this.props.game.status === "creating") {
      return <div><i className="notched circle loading icon"></i>Waiting for another player</div>
    }
    else if (readonly) {
      return <div>Not your turn</div>
    } else {
      return <div>It is your turn</div>
    }
  }

  renderSpectatorBox() {
    if (!this.props.game.p2 && this.props.currentUser) {
      return (
        <div>
          <div>Want to join the game?</div>
          <button onClick={this.handleJoinGame.bind(this)} className="massive positive ui button">Join Game</button>
        </div>
      )
    }
    return <div>You are currently spectating</div>
  }

  render() {
    if (this.props.game.status === "winner") {
      var winner = <div>Somebody won the game!!</div>
    }
    return (
      <div className="center">
        { this.props.spectatorMode === true ? this.renderSpectatorBox() : this.renderCurrentTurn(this.props.readonly)}
        <div>{ "Moves taken: " + this.props.game.movesTaken }</div>
        <div>{ "Time taken: " + this.props.timeTaken }</div>
      </div>
    )
  }
}
