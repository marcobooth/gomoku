import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class Board extends Component {
  handleGameMove(row, col) {
    let { readonly, game } = this.props

    if (!readonly) {
      Meteor.call('games.handleMove', game._id, row, col);
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

          return <div className="boardSquare" key={pointIndex}
              onClick={this.handleGameMove.bind(this, rowIndex, pointIndex)}>
            <div className="content"
                 style={{ background }}>
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
