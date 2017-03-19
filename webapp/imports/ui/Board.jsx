import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class Board extends Component {

  handleGameMove(rowIndex, pointIndex) {
    if (!this.props.readonly) {
      Meteor.call('games.handleMove', this.props.game._id, rowIndex, pointIndex);
    }
  }

  renderBoard(readonly) {
    return renderedBoard = this.props.game.board.map((row, rowIndex) => {
      return <div className="row" key={rowIndex} style={{display: 'flex'}}>
        {row.map((point, pointIndex) => {

          let background = "white"
          if (point === this.props.game.p1) {
            background = this.props.game.p1Colour
          } else if (point === this.props.game.p2) {
            background = this.props.game.p2Colour
          }

          return <div className="boardSquare" key={pointIndex}>
            <div className="content"
                 style={{ background }}
                 onClick={this.handleGameMove.bind(this, rowIndex, pointIndex)}>
            </div>
          </div>
        })}
      </div>
    })
  }

  render() {
    return (
      <div>
        {this.renderBoard(this.props.readonly)}
      </div>
    )
  }
}
