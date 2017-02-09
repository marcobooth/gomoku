import React from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {putPieceOnBoard} from '../../both/utilities'
import Board from './board'
import Messages from './messages'
import {
  rotatePiece,
  movePiece,
  placePiece,
  joinGame,
  startGame,
  restartGame,
} from "../actions/allActions"
import _ from 'underscore'

export const Game = React.createClass({
  mixins: [PureRenderMixin],

  handleKeys(event) {
    let {
      params: {roomName, username},
      masterUsername,
      alreadyStarted,
      dispatch
    } = this.props

    if (alreadyStarted && event.key === 'ArrowUp') {
      dispatch(rotatePiece(roomName, username))
    } else if (alreadyStarted && event.key === 'ArrowDown') {
      dispatch(movePiece(roomName, username, "down"))
    } else if (alreadyStarted && event.key === 'ArrowRight') {
      dispatch(movePiece(roomName, username, "right"))
    } else if (alreadyStarted && event.key === 'ArrowLeft') {
      dispatch(movePiece(roomName, username, "left"))
    } else if (alreadyStarted && event.key === ' ') {
      dispatch(placePiece(roomName, username))
    } else if (event.key === 'Enter' &&
        username === masterUsername && !alreadyStarted) {
      dispatch(startGame(roomName, username))
    } else if (event.key === 'r' &&
        username === masterUsername && alreadyStarted) {
      dispatch(restartGame(roomName, username))
    }
  },

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeys, false);
  },
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeys, false);
  },

  componentDidUpdate() {
    let {
      params: { roomName, username },
      otherBoards,
      alreadyStarted,
      masterUsername,
      dispatch
    } = this.props

    // first update the list of current users
    if (otherBoards) {
      this.currentUsernames = otherBoards.keySeq().toArray()

      // start the timer if necessary
      if (masterUsername === username &&
          alreadyStarted && !this.intervalStarted) {
        setInterval(() => {
          _.each(this.currentUsernames, (username) => {
            dispatch(movePiece(roomName, username, "down"))
          })
        }, 500)

        this.intervalStarted = true
      }
    }
  },

  render: function() {
    // join the game
    if (this.props.connected && !this.props.joined && !this.props.alreadyStarted) {
      let { roomName, username } = this.props.params
      this.props.dispatch(joinGame(roomName, username))
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
    let board = putPieceOnBoard(this.props.board, this.props.currentPiece)

    let squareSize = 30
    let boxStyle = {
      height: `${squareSize}px`,
      width: `${squareSize}px`,
    }

    var ghostList = this.props.otherBoards.entrySeq().map(([key, value], index) => {
      if (!(this.props.params.username === key)) {
        let clientBoard = value.get('board')
        for (var i = 0; i < 20; i++) {
          for (var j = 0; j < 10 ; j++) {
            let currentPiece = clientBoard.getIn([i, j])
            if (currentPiece != null) {
              if (currentPiece != 'FF0000') {
                clientBoard = clientBoard.updateIn([i, j], current => { return 'FF0000' })
              }
              if (i != 19) {
                clientBoard = clientBoard.updateIn([i + 1, j], current => { return 'FF0000' })
              }
            }
          }
        }
        return (
          <div key={index}>
            <h3>{key}</h3>
            <div style={{border: '1px solid red'}}>
              <Board key={index} board={clientBoard} squareSize={15} />
            </div>
          </div>
        )
      }
    })

    return (
      <div>
        <h1> { this.props.winnerState } </h1>
        <Board board={board} squareSize={30}/>
        <div style={{display: 'inline-block', opacity: 0.5}}>
          { ghostList }
        </div>
        <Messages {...this.props}/>
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
    winnerState: state.getIn(clientPath.concat(['winnerState'])),
    board: state.getIn(clientPath.concat(['board'])),
    joined: state.getIn(clientPath.concat(['joined'])),
    connected: state.get("connected"),
    otherBoards: state.getIn(['games', roomName, 'clients']),
  }
}

export const GameContainer = connect(mapStateToProps)(Game);
