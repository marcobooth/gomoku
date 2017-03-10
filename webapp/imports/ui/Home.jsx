import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { pathFor } from '../../utilities/flow_helper.js';
import { Games } from '../api/collections.js';
import HighScores from './HighScores.jsx'

class Home extends Component {

  handleClick(typeGame) {
    Meteor.call('games.insert', typeGame, (error, _id) => {
      if (error) {
        console.log("making a new game error:", error)
      }
      else if (_id) {
        FlowRouter.go('Games.show', { _id });
      }
    })
  }

  renderGames(games) {
    if (games) {
      return renderGames = games.map((game, index) => {
        return (
          <div key={index}>
            <a href={ pathFor('Games.show', { _id: game._id })}>{game._id}</a>
          </div>
        )
      })
    }
  }

  render() {

    if (!this.props.subscription.ready()) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <div className="ui two column centered grid">
          <div className="four wide column">
            <button className="massive ui labeled icon button" onClick={this.handleClick.bind(this, "player")}>
              <i className="user icon"></i>
              1 v 1
            </button>
          </div>
          <div className="four wide column">
            <button className="massive ui right labeled icon button" onClick={this.handleClick.bind(this, "AI")}>
              <i className="laptop icon"></i>
              1 v AI
            </button>
          </div>
        </div>
        <h3>Games to Watch</h3>
        { this.renderGames(this.props.startedGames) }
        <h3>Games to Join</h3>
        { this.renderGames(this.props.joinableGames) }

        <HighScores />
      </div>

    );
  }
}

Home.propTypes = {
};

export default createContainer(() => {

  return {
    subscription: Meteor.subscribe('gamesData'),
    startedGames: Games.find({ status: 'started'}).fetch(),
    joinableGames: Games.find({ status: 'creating'}).fetch(),
  };
}, Home);
