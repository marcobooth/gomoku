import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';

export default class Board extends Component {

  handleJoinGame() {
    Meteor.call('games.join', this.props.game._id);
  }

  handleGameMove(rowIndex, pointIndex) {
    Meteor.call('games.handleMove', this.props.game._id, rowIndex, pointIndex);
  }

  renderCurrentTurn(readonly) {
    if (readonly) {
      return <div>Not your turn</div>
    } else {
      return <div>It is your turn</div>
    }
  }

  renderSpectatorBox() {
    if (!this.props.game.p2) {
      return (
        <div>
          <div>Want to join the game?</div>
          <button onClick={this.handleJoinGame.bind(this)} className="massive positive ui button">Join Game</button>
        </div>
      )
    }
    return <div>You are currently spectating</div>
  }

  renderBoard(readonly) {
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
          if (readonly) {
            return <div className="dot"
              key={pointIndex}
              style={{background: currentPointColour}}>
            </div>
          }
          else {
            return <div className="dot"
              key={pointIndex}
              style={{background: currentPointColour}}
              onClick={this.handleGameMove.bind(this, rowIndex, pointIndex)}>
            </div>
          }
        })}
      </div>
    });
    return renderedBoard;
  }

  render() {
    console.log("in Board");
    console.log("this.props:", this.props)
    let { currentUser, game } = this.props

    let readonly
    let spectatorMode = false
    if (!currentUser || (game.p1 != currentUser._id && game.p2 != currentUser._id)) {
      spectatorMode = true
      readonly = true
    } else {
      // checks if game has started, is over, or if this player has the current turn
      readonly = game.status === "creating" || game.status === "winner" || (currentUser._id != game.currentPlayer)
    }

    return (
      <div>
        { spectatorMode ? this.renderSpectatorBox() : this.renderCurrentTurn(readonly)}
        {this.renderBoard(readonly)}
      </div>
    )
  }
}

Board.propTypes = {
}
