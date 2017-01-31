import React from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {BoardRow} from './boardRow'
import {putPieceOnBoard} from '../../both/utilities'

export const Board = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    let squareSize = 30

    if (!this.props.board) {
      return <div />
    }

    let board = putPieceOnBoard(this.props.board, this.props.currentPiece)
    console.log("board:", board);

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
