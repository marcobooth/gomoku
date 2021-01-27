import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { pathFor } from '../utilities/flow_helper.js';
import { Games } from '../api/collections.js';
import HighScores from './HighScores.jsx'
import { ReactiveVar } from 'meteor/reactive-var'

class Home extends Component {
  constructor() {
    super()

    this.state = {
      vsAILoading: false,
      vsHumanLoading: false,
    }
  }

  handleClick(isAI) {
    Meteor.call('games.insert', isAI, (error, _id) => {
      if (error) {
        console.log("making a new game error:", error)
      } else if (_id) {
        FlowRouter.go('Games.show', { _id });
      }
    })

    this.setState({ [ isAI ? "vsAILoading" : "vsHumanLoading" ]: true })
  }

  openLoginMenu() {
    event.preventDefault()
    $('#login-sign-in-link').click()
  }

  renderButtons(loggedInUser) {
    if (! loggedInUser) {
      return <div className="ui huge primary button" onClick={this.openLoginMenu.bind(this)}>Signup / Login</div>
    }

    let vsHumanClasses = "ui huge primary button"
    let vsAIClasses = "ui huge primary button"
    if (this.state.vsHumanLoading) {
      vsHumanClasses += " loading"
    }
    if (this.state.vsAILoading) {
      vsAIClasses += " loading"
    }

    return (
      <div>
        <div id="mainButton" className={vsHumanClasses}
            onClick={this.handleClick.bind(this, false)}>
          Play Against A Friend
        </div>
        <div className={vsAIClasses}
            onClick={this.handleClick.bind(this, true)}>
          Play Against AI
        </div>
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

    let loadMoreWatchable
    if (this.props.watchableGames.length < this.props.watchableLimit.curValue) {
      loadMoreWatchable = <div className="center"><a onClick={this.props.loadMoreWatchableGames.bind(this)}>Show more...</a></div>
    }

    let loadMoreMyGames
    if (this.props.myGames.length < this.props.myGamesLimit.curValue) {
      loadMoreMyGames = <div className="center"><a onClick={this.props.loadMoreMyGames.bind(this)}>Show more...</a></div>
    }

    let loadMoreJoinableGames
    if (this.props.joinableGames.length < this.props.creatingLimit.curValue) {
      loadMoreJoinableGames = <div className="center"><a onClick={this.props.loadMoreCreatingGames.bind(this)}>Show more...</a></div>
    }

    console.log("length", this.props.joinableGames.length)
    console.log("limit", this.props.creatingLimit.curValue)

    return (
      <div>
        <div id="mainHeader" className="ui inverted vertical masthead center aligned segment">
          <h1 className="ui header">
            Play the Game
          </h1>
          <h2>We really hope you lose. Honestly, it would help us a lot in the correction.</h2>
          <div className="buttons">
            { this.renderButtons(this.props.loggedInUser) }
          </div>
        </div>

        <div className="ui container findMoreGames">
          <div className="ui grid">
            <div className="five wide column">
              <h2 className="center">Your Games</h2>
              { this.renderGames(this.props.myGames, true) }
              {loadMoreWatchable}
            </div>
            <div className="five wide column">
              <h2 className="center">Watch a Game</h2>
              { this.renderGames(this.props.watchableGames, true) }
              {loadMoreMyGames}
            </div>
            <div className="five wide column">
              <h2 className="center">Join a Game</h2>
              { this.renderGames(this.props.joinableGames, false) }
              {loadMoreJoinableGames}
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
      watchableLimit: new ReactiveVar(5),
      myGamesLimit: new ReactiveVar(5),
      creatingLimit: new ReactiveVar(5)
    }
  },
  getMeteorData(props, state) {
    let loggedInUser = Meteor.user() ? Meteor.user()._id : null

    const { watchableLimit, myGamesLimit, creatingLimit } = state
    let watchableSub =
        Meteor.subscribe("watchableGames", watchableLimit.get())
    let watchableGames = Games.find({
      status: 'started',
      p1: { $ne: loggedInUser },
      p2: { $ne: loggedInUser },
    }, {
      limit: watchableLimit.get()
    }).fetch()

    let myGamesSub =
        Meteor.subscribe("myGames", myGamesLimit.get())
    let myGames = Games.find({
      status: 'started',
      $or: [
        { p1: loggedInUser },
        { p2: loggedInUser },
      ],
    }, {
      limit: myGamesLimit.get()
    }).fetch()

    let creatingSub =
        Meteor.subscribe("joinableGames", creatingLimit.get())
    let joinableGames = Games.find({
      status: 'creating'
    }, {
      limit: creatingLimit.get()
    }).fetch()

    return {
      watchableLimit,
      myGamesLimit,
      creatingLimit,
      loggedInUser,
      loadingData: !watchableSub.ready() || !myGamesSub.ready() || !creatingSub.ready(),
      joinableGames,
      myGames,
      watchableGames,
      loadMoreWatchableGames() { watchableLimit.set(watchableLimit.get() + 5) },
      loadMoreMyGames() { myGamesLimit.set(myGamesLimit.get() + 5) },
      loadMoreCreatingGames() { creatingLimit.set(creatingLimit.get() + 5) }
    }
  }
}, Home)
