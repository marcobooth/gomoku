import React from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {BoardRow} from './boardRow'
import {putPieceOnBoard} from '../../both/utilities'
import {
  rotatePiece,
  movePiece,
  placePiece,
} from "../actions/allActions"

export const Board = React.createClass({
  mixins: [PureRenderMixin],

  handleKeys(event) {
    if (event.key === 'ArrowUp') {
      this.props.dispatch(rotatePiece())
    } else if (event.key === 'ArrowDown') {
      this.props.dispatch(movePiece("down"))
    } else if (event.key === 'ArrowRight') {
      this.props.dispatch(movePiece("right"))
    } else if (event.key === 'ArrowLeft') {
      this.props.dispatch(movePiece("left"))
    } else if (event.key === ' ') {
      this.props.dispatch(placePiece())
    }
  },

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeys, false);
  },
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeys, false);
  },

  render: function() {
    let squareSize = 30

    if (!this.props.board) {
      return <div />
    }

    let board = putPieceOnBoard(this.props.board, this.props.currentPiece)

    return (
      <div style={{width: `${squareSize * 10}px`, height: `${squareSize * 20}px`}}>
        {board.map((row, index) => {
          return <BoardRow row={row} squareSize={squareSize} key={index} />
        })}
      </div>
    )
  }
});

function mapStateToProps(state) {
  let currentPiece = state.getIn(['clients', 'tfleming', 'currentPiece']);
  let board = state.getIn(['clients', 'tfleming', 'board'])

  return { board, currentPiece }
}

export const BoardContainer = connect(mapStateToProps)(Board);
