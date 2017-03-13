import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { pathFor } from '../utilities/flow_helper.js';
import { Games } from '../api/collections.js';
import HighScores from './HighScores.jsx'
import { Session } from 'meteor/session'

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
        if (isWatchable === false && Meteor.user() && game.p1 === Meteor.user()._id) {
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

  componentWillUnmount() {
    delete Session.keys['showGamesLimit']
  }

  showMoreGames(e) {
    e.preventDefault()
    Session.set("showGamesLimit", 10)
  }

  render() {
    if (!this.props.loading) {
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
              <div onClick={this.showMoreGames.bind(this)}>Show more...</div>
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
  Session.get("showGamesLimit") ? '' : Session.set("showGamesLimit", 4)
  let fetchGame = Meteor.subscribe('games')
  return {
    loading: fetchGame.ready(),
    startedGames: Games.find({ status: 'started'}, { limit: Session.get("showGamesLimit") }).fetch(),
    joinableGames: Games.find({ status: 'creating'}, { limit: 5 }).fetch(),
  }
}, Home)
