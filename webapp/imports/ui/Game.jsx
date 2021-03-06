import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Games } from '../api/collections.js';
import Board from './Board.jsx'
import GameInfo from './GameInfo.jsx'
import PieceColour from './PieceColour.jsx'
import GameMessages from './GameMessages.jsx'
import { createBoardState } from "../engine/gomokuEngine"
import Winner from './Winner.jsx'

class Game extends Component {

  constructor(props) {
    super(props)
    this.state = { timeTaken: "0.0s" }
  }

  componentWillMount() {
    this.engine = Tracker.autorun(() => {
      let game = Games.findOne(FlowRouter.getParam("_id"))
      window.Games = Games

      if (game && game.status === "started") {
        let userId = Meteor.userId()

        if (game.currentPlayer === userId) {
          console.log("our turn")
        } else if (game.currentPlayer === "AI" &&
            (userId === game.p1 || userId === game.p2)) {
          console.log("game:", game);
          console.log("AI's turn -- running the engine");
          let state = createBoardState("AI", userId, game.board)
          console.log("state:", state);

          let start = new Date().getTime()
          let bestMove = state.getBestMove()
          let end = new Date().getTime()
          this.setState({
            timeTaken: `${end - start}ms`
          })
          console.assert(bestMove, "Couldn't find a best move!!!")

          let { row, col } = bestMove
          console.log(`took ${end - start}ms to generate best move: ` +
              `(${row}, ${col})`)
          Meteor.call('games.handleMove', game._id, row, col);
        }
      }
    })
  }

  componentWillUnmount() {
    this.engine.stop()
  }

  render() {
    if (!this.props.loaded) {
      return (
        <div>
          <button className="ui loading button"></button>
          Loading...
        </div>
      )
    }

    console.log("state", this.state)

    // let game, status, currentUser = { this.props... }
    if (!this.props.game) {
      return (<div>Invalid game!</div>)
    }

    let { currentUser, game } = this.props

    let readonly
    let spectatorMode = false
    if (!currentUser || (game.p1 !== currentUser._id && game.p2 !== currentUser._id)) {
      spectatorMode = true
      readonly = true
    } else {
      // checks if game has started, is over, or if this player has the current turn
      readonly = game.status === "creating" || game.status === "winner" ||
          (currentUser._id != game.currentPlayer)
    }

    return (
      <div className="ui container spaceHeader">
        <Winner game={this.props.game} currentUser={this.props.currentUser} />
        <div className="ui very relaxed stackable grid">
          <div className="eight wide column">
            <Board game={this.props.game} readonly={readonly} />
          </div>
          <div className="eight wide column">
            <h2 className="center">Game Information</h2>
            <GameInfo game={this.props.game} spectatorMode={spectatorMode} readonly={readonly} currentUser={this.props.currentUser} timeTaken={this.state.timeTaken} />
            <PieceColour game={this.props.game} currentUser={this.props.currentUser} />
            <GameMessages />
          </div>
        </div>

      </div>
    );
  }
}

Game.propTypes = {
  game: React.PropTypes.object,
  currentUser: React.PropTypes.object
}

export default createContainer(( params ) => {
  let gameId = FlowRouter.getParam("_id")
  let fetchGame = Meteor.subscribe('game', gameId)
  return {
    loaded: fetchGame.ready(),
    game: Games.findOne(gameId),
    currentUser: Meteor.user(),
  };
}, Game);
