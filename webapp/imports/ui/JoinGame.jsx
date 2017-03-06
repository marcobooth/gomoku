import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class JoinGame extends Component {

  handleJoinGame() {
    Meteor.call('games.join', this.props.game._id);
  }

  joinGameButton() {
    return <div onClick={this.handleJoinGame.bind(this)}>Click me!</div>
  }

  render() {
      console.log("this.props:", this.props)
      let mainContent
      if (this.props.currentUser && this.props.currentUser._id === this.props.game.p1) {
        mainContent = <div>Waiting for another player</div>
      } else if (this.props.currentUser && this.props.currentUser._id) {
        mainContent = <div>{this.joinGameButton()}</div>
      } else {
        mainContent = <div>Please login to join a game</div>
      }

    return (
      <div className="container">
        <div>
          { mainContent }
        </div>
      </div>
    );
  }
}

JoinGame.propTypes = {
};
