import React from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {putPieceOnBoard} from '../../both/utilities'
import Board from './board'
import {
  rotatePiece,
  movePiece,
  placePiece,
  joinGame,
  startGame,
} from "../actions/allActions"

export const Game = React.createClass({
  mixins: [PureRenderMixin],

  handleKeys(event) {
    let {
      params: {roomName, username},
      masterUsername,
      alreadyStarted,
    } = this.props

    if (alreadyStarted && event.key === 'ArrowUp') {
      this.props.dispatch(rotatePiece(roomName, username))
    } else if (alreadyStarted && event.key === 'ArrowDown') {
      this.props.dispatch(movePiece(roomName, username, "down"))
    } else if (alreadyStarted && event.key === 'ArrowRight') {
      this.props.dispatch(movePiece(roomName, username, "right"))
    } else if (alreadyStarted && event.key === 'ArrowLeft') {
      this.props.dispatch(movePiece(roomName, username, "left"))
    } else if (alreadyStarted && event.key === ' ') {
      this.props.dispatch(placePiece(roomName, username))
    } else if (event.key === 'Enter' &&
        username === masterUsername && !alreadyStarted) {
      this.props.dispatch(startGame(roomName, username))
    }
  },

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeys, false);
  },
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeys, false);
  },

  render: function() {
    // join the game
    if (this.props.connected && !this.joinedGame) {
      let { roomName, username } = this.props.params
      this.props.dispatch(joinGame(roomName, username))

      this.joinedGame = true
    }

    // wait for the board to load
    if (!this.props.board) {
      return <div>Loading...</div>
    }

    // make sure it's started
    if (!this.props.alreadyStarted) {
      let { masterUsername } = this.props

      if (this.props.params.username === masterUsername) {
        return ( <div>Press ENTER to start</div> )
      } else {
        return ( <div>Waiting for {masterUsername} to start the game...</div> )
      }
    }

    // draw the board
    console.log("this.props.currentPiece.toJS():", this.props.currentPiece.toJS());
    let board = putPieceOnBoard(this.props.board, this.props.currentPiece)

    let squareSize = 30
    let boxStyle = {
      height: `${squareSize}px`,
      width: `${squareSize}px`,
    }

    return (
      <div>
        <Board board={board} squareSize={30}/>
      </div>
    )
  }
});

function mapStateToProps(state, props) {
  let { roomName, username } = props.params
  let clientPath = ['games', roomName, 'clients', username]
  let gamePath = ['games', roomName, 'game']

  return {
    alreadyStarted: state.getIn(gamePath.concat(['alreadyStarted'])),
    masterUsername: state.getIn(gamePath.concat(['masterUsername'])),
    currentPiece: state.getIn(clientPath.concat(['currentPiece'])),
    board: state.getIn(clientPath.concat(['board'])),
    connected: state.get("connected"),
    otherBoards: state.getIn(['games', roomName, 'clients']),
  }
}

export const GameContainer = connect(mapStateToProps)(Game);
