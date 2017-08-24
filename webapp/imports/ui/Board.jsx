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
    let board = this.props.game.board.map((row, rowIndex) => {
      return row.map((point) => {
        return { color: point }
      })
    })

    if (this.props.game.status === "winner") {
      _.each(this.props.game.winningMoves, (move) => {
        board[move[0]][move[1]].winningMove = true
      })
    }

    return renderedBoard = board.map((row, rowIndex) => {
      return <div className="row" key={rowIndex} style={{display: 'flex'}}>
        {row.map((cell, pointIndex) => {

          let background = "white"
          if (cell.winningMove === true) {
            background = "lightblue"
          }
          else if (cell.color === this.props.game.p1) {
            background = this.props.game.p1Colour
          } else if (cell.color === this.props.game.p2) {
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
