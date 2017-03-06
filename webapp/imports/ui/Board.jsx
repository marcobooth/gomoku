import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';

export default class Board extends Component {

  handleGameMove(rowIndex, pointIndex) {
    Meteor.call('games.handleMove', this.props.game._id, rowIndex, pointIndex);
  }

  renderCurrentTurn(readonly) {
    if (this.props.game.status !== "winner") {
      if (readonly) {
        return <div>Not your turn</div>
      } else {
        return <div>It is your turn</div>
      }
    }
  }

  renderBoard(readonly) {
    if (this.props.game.status === "winner") {
      readonly = true
    }
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
    console.log("this.props:", this.props)
    let readonly = (this.props.currentUser._id != this.props.game.currentPlayer)
    return (
      <div className="container">
        <div>
          {this.renderCurrentTurn(readonly)}
          {this.renderBoard(readonly)}
        </div>
      </div>
    );
  }
}

Board.propTypes = {
};
