import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { pathFor } from '../utilities/flow_helper.js';
import { Games } from '../api/collections.js';
import HighScores from './HighScores.jsx'
import { ReactiveVar } from 'meteor/reactive-var'

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

  openLoginMenu() {
    return 1
  }

  renderButtons() {
    if (! Meteor.user()) {
      return <div className="ui huge primary button" onClick={this.openLoginMenu.bind(this)}>Signup / Login</div>
    }
    return (
      <div>
        <div id="mainButton" className="ui huge primary button" onClick={this.handleClick.bind(this, false)}>Play Against A Friend</div>
        <div className="ui huge primary button" onClick={this.handleClick.bind(this, true)}>Play Against AI</div>
      </div>
    )
  }

  renderGames(games, isWatchable) {
    let renderGames
    if (games) {
      renderGames = games.map((game, index) => {
        let linkText
        if (isWatchable === false && Meteor.user() && game.p1 === Meteor.user()._id) {
          return null
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
      // removes falsey values "", 0 and undefined
      renderGames = renderGames.filter(Boolean)
    }

    if (renderGames.length === 0) {
      return <div className="center">No games available</div>
    } else {
      return renderGames
    }
  }

  render() {
    if (this.props.loadingData) {
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
            { this.renderButtons() }
          </div>
        </div>

        <div className="ui container findMoreGames">
          <div className="ui grid">
            <div className="eight wide column">
              <h2 className="center">Watch a Game</h2>
              { this.renderGames(this.props.startedGames, true) }
              <a onClick={this.props.loadMoreStartedGames.bind(this)}>Show more...</a>
            </div>
            <div className="eight wide column">
              <h2 className="center">Join a Game</h2>
              { this.renderGames(this.props.joinableGames, false) }
              <a onClick={this.props.loadMoreStartedGames.bind(this)}>Show more...</a>
            </div>
          </div>

          <HighScores />
        </div>
      </div>

    )
  }
}

export default createContainer({
  getInitialState() {
    return {
      startedLimit: new ReactiveVar(5),
      creatingLimit: new ReactiveVar(5)
    }
  },
  getMeteorData(props, state) {
    const { startedLimit, creatingLimit } = state

    let startedSub =
        Meteor.subscribe("listGames", "started", startedLimit.get())
    let startedGames = Games.find({
      status: 'started'
    }, {
      limit: startedLimit.get()
    }).fetch()

    let creatingSub =
        Meteor.subscribe("listGames", "creating", creatingLimit.get())
    let joinableGames = Games.find({
      status: 'creating'
    }, {
      limit: creatingLimit.get()
    }).fetch()

    return {
      loadingData: !startedSub.ready() || !creatingSub.ready(),
      startedGames,
      joinableGames,
      loadMoreStartedGames() { startedLimit.set(startedLimit.get() + 5) },
      loadMoreCreatingGames() { creatingLimit.set(creatingLimit.get() + 5) }
    }
  }
}, Home)
