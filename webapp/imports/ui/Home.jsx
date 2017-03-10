import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { pathFor } from '../utilities/flow_helper.js';
import { Games } from '../api/collections.js';
import HighScores from './HighScores.jsx'

class Home extends Component {

  handleClick(isAI) {
    Meteor.call('games.insert', isAI, (error, _id) => {
      if (error) {
        console.log("making a new game error:", error)
      }
      else if (_id) {
        FlowRouter.go('Games.show', { _id });
      }
    })
  }

  renderGames(games, isWatchable) {
    if (games) {
      return renderGames = games.map((game, index) => {
        let linkText
        if (isWatchable === false && game.p1 === Meteor.user()._id) {
          return ''
        }
        else if (isWatchable) {
          linkText = game.p1Username + " vs. " + game.p2Username
        } else {
          linkText = "Play against " + game.p1Username
        }
        return (
          <div className="center" key={index}>
            <a href={ pathFor('Games.show', { _id: game._id })}>
              { linkText }
              <i className="angle right icon"></i>
            </a>
          </div>
        )
      })
    }
  }

  render() {

    if (!this.props.subscription) {
      return <div><button className="ui loading button"></button>Loading...</div>
    }

    return (
      <div>
        <div id="mainHeader" className="ui inverted vertical masthead center aligned segment">
          <h1 className="ui header">
            Play the Game
          </h1>
          <h2>We really hope you lose. Honestly, it would help us a lot in the correction.</h2>
          <div className="buttons">
            <div id="mainButton" className="ui huge primary button" onClick={this.handleClick.bind(this, false)}>Play Against A Friend</div>
            <div className="ui huge primary button" onClick={this.handleClick.bind(this, true)}>Play Against AI</div>
          </div>
        </div>

        <div className="ui container findMoreGames">
          <div className="ui grid">
            <div className="eight wide column">
              <h2 className="center">Watch a Game</h2>
              { this.renderGames(this.props.startedGames, true) }
            </div>
            <div className="eight wide column">
              <h2 className="center">Join a Game</h2>
              { this.renderGames(this.props.joinableGames, false) }
            </div>
          </div>

          <HighScores />
        </div>
      </div>

    )
  }
}

export default createContainer(() => {
  return {
    subscription: Meteor.subscribe('games').ready(),
    startedGames: Games.find({ status: 'started'}, { limit: 5 }).fetch(),
    joinableGames: Games.find({ status: 'creating'}, { limit: 5 }).fetch(),
  }
}, Home)
