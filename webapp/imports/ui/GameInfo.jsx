import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class Board extends Component {

  handleJoinGame() {
    Meteor.call('games.join', this.props.game._id);
  }

  giveUp() {
    Meteor.call('games.giveUp', this.props.game._id, Meteor.user()._id)
  }

  openLoginMenu() {
    event.preventDefault()
    $('#login-sign-in-link').click()
  }

  renderCurrentTurn(readonly) {
    if (this.props.game.status === "creating") {
      return <div><i className="notched circle loading icon"></i>Waiting for another player</div>
    } else if (readonly) {
      return <div>Not your turn</div>
    } else {
      return <div>It is your turn</div>
    }
  }

  renderGiveUp(game) {
    if (game.status !== "started" || !Meteor.user())
      return

    if (game.p1 === Meteor.user()._id || game.p2 === Meteor.user()._id)
      return <div><button onClick={this.giveUp.bind(this)} className="small negative ui button">Give Up</button></div>
  }

  renderSpectatorBox() {
    if (!this.props.game.p2) {
      let button
      if (this.props.currentUser) {
        button = <button onClick={this.handleJoinGame.bind(this)} className="massive positive ui button">Join Game</button>
      } else {
        button = <button onClick={this.openLoginMenu.bind(this)} className="massive positive ui button">Sign In to Join</button>
      }
      return (
        <div>
          <div>Want to join the game?</div>
          {button}
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
        { this.renderGiveUp(this.props.game) }
        { "Moves taken: " + this.props.game.movesTaken }
      </div>
    )
  }
}
