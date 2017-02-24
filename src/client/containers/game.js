import React from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { startGame } from "../actions/allActions"
import _ from 'underscore'

export const Game = React.createClass({
  mixins: [PureRenderMixin],

  // componentWillMount() {
  //   document.addEventListener("keydown", this.handleKeys, false);
  // },
  // componentWillUnmount() {
  //   document.removeEventListener("keydown", this.handleKeys, false);
  // },

  // componentDidUpdate() {
  //   let {
  //     params: { roomName, username },
  //     otherBoards,
  //     alreadyStarted,
  //     masterUsername,
  //     dispatch
  //   } = this.props
  //
  //   // first update the list of current users
  //   if (otherBoards) {
  //     this.currentUsernames = otherBoards.keySeq().toArray()
  //
  //     // start the timer if necessary
  //     if (masterUsername === username &&
  //         alreadyStarted && !this.intervalStarted) {
  //       setInterval(() => {
  //         _.each(this.currentUsernames, (username) => {
  //           dispatch(movePiece(roomName, username, "down"))
  //         })
  //       }, 500)
  //
  //       this.intervalStarted = true
  //     }
  //   }
  // },

  render: function() {
    // make sure it's started
    // if (!this.props.alreadyStarted) {
    //   return ( <div>Go create a game!</div> )
    // }

    // let squareSize = 30
    // let boxStyle = {
    //   height: `${squareSize}px`,
    //   width: `${squareSize}px`,
    // }
    return (
      <div>
        <h3>Welcome to da game</h3>
        // <h3 onClick={() => this.handleKeys("hello")} className="title"> { this.props.score } </h3>
        // <div style={{display: 'flex', justifyContent: 'center'}}>
        //   <Board board={board} squareSize={30}/>
        // </div>
      </div>
    )
  }
});

function mapStateToProps(state, props) {

  return {
    // connected: state.get("connected"),
  }
}

export const GameContainer = connect(mapStateToProps)(Game);
