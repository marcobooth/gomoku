import React from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {BoardRow} from './boardRow'
import {putPieceOnBoard} from '../../both/utilities'
import {
  rotatePiece,
  movePiece,
  placePiece,
  joinGame
} from "../actions/allActions"

export const Board = React.createClass({
  mixins: [PureRenderMixin],

  handleKeys(event) {
    let { roomName, username } = this.props.params

    if (event.key === 'ArrowUp') {
      this.props.dispatch(rotatePiece(roomName, username))
    } else if (event.key === 'ArrowDown') {
      this.props.dispatch(movePiece(roomName, username, "down"))
    } else if (event.key === 'ArrowRight') {
      this.props.dispatch(movePiece(roomName, username, "right"))
    } else if (event.key === 'ArrowLeft') {
      this.props.dispatch(movePiece(roomName, username, "left"))
    } else if (event.key === ' ') {
      this.props.dispatch(placePiece(roomName, username))
    }
  },

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeys, false);

    let { roomName, username } = this.props.params
    this.props.dispatch(joinGame(roomName, username))
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
