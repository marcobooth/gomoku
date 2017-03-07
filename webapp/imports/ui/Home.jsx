import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { pathFor } from '../../utilities/flow_helper.js';
import { Games } from '../api/collections.js';

class Home extends Component {

  handleClick(typeGame) {
    Meteor.call('games.insert', typeGame, (error, _id) => {
      if (error) {
        console.log("making a new game error:", error)
      }
      if (_id) {
        FlowRouter.go('Games.show', { _id });
      }
      // console.log("gameId:", gameId)
    });
    // console.log("I have been clicked")
  }

  renderBoardIds() {
    return this.props.boards.map((board) => {
      return (<li><a href={ pathFor( '/boards/:id', { id: board._id }) }> {board._id}</a></li>);
    });
  }

  render() {
    return (
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
    );
  }
}

Home.propTypes = {
};

export default createContainer(() => {

  return {
    games: Games.find({}).fetch(),
  };
}, Home);
