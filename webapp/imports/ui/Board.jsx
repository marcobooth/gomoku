import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class Board extends Component {

  handleGameMove(rowIndex, pointIndex) {
    Meteor.call('games.handleMove', this.props.game._id, rowIndex, pointIndex);
  }

  renderBoard(readonly) {
    return renderedBoard = this.props.game.board.map((row, rowIndex) => {
      return <div className="row" key={rowIndex} style={{display: 'flex'}}>
        {row.map((point, pointIndex) => {

          let currentPointColour = "grey"
          if (point === this.props.game.p1) {
            currentPointColour = this.props.game.p1Colour
          }
          else if (point === this.props.game.p2) {
            currentPointColour = this.props.game.p2Colour
          }

          if (readonly) {
            return <div className="box" key={pointIndex}>
                      <div className="dot"
                        style={{background: currentPointColour}}>
                      </div>
                    </div>
          } else {
            return <div className="box" key={pointIndex}>
                    <div className="dot"
                         style={{background: currentPointColour}}
                         onClick={this.handleGameMove.bind(this, rowIndex, pointIndex)}>
                    </div>
                   </div>
          }
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
