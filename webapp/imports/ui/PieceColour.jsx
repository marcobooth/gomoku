import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class PieceColour extends Component {

  handlePieceColourChange(colour) {
    Meteor.call('games.changePieceColour', this.props.game._id, this.props.currentUser._id, colour);
  }

  componentDidMount() {
    $('.ui.dropdown').dropdown()
  }

  render() {
      console.log("this.props:", this.props)

    return (
      <div>
        <div className="ui dropdown">
          <div className="text">Change piece colour</div>
          <i className="dropdown icon"></i>
          <div className="menu">
            <div onClick={this.handlePieceColourChange.bind(this, "red")} className="item ui red button">Red</div>
            <div onClick={this.handlePieceColourChange.bind(this, "orange")} className="item ui orange button">Orange</div>
            <div onClick={this.handlePieceColourChange.bind(this, "yellow")} className="item ui yellow button">Yellow</div>
            <div onClick={this.handlePieceColourChange.bind(this, "olive")} className="item ui olive button">Olive</div>
            <div onClick={this.handlePieceColourChange.bind(this, "green")} className="item ui green button">Green</div>
            <div onClick={this.handlePieceColourChange.bind(this, "teal")} className="item ui teal button">Teal</div>
            <div onClick={this.handlePieceColourChange.bind(this, "blue")} className="item ui blue button">Blue</div>
          </div>
        </div>
      </div>
    );
  }
}

PieceColour.propTypes = {
};
