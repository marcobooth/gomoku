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

    if (!this.props.currentUser) {
      return <div></div>
    }

    return (
      <div className="center">
        <div className="ui dropdown">
          <div className="text">Change piece colour</div>
          <i className="dropdown icon"></i>
          <div className="menu">
            <div onClick={this.handlePieceColourChange.bind(this, "red")} className="item ui red basic button">Red</div>
            <div onClick={this.handlePieceColourChange.bind(this, "orange")} className="item ui orange basic button">Orange</div>
            <div onClick={this.handlePieceColourChange.bind(this, "yellow")} className="item ui yellow basic button">Yellow</div>
            <div onClick={this.handlePieceColourChange.bind(this, "olive")} className="item ui olive basic button">Olive</div>
            <div onClick={this.handlePieceColourChange.bind(this, "green")} className="item ui green basic button">Green</div>
            <div onClick={this.handlePieceColourChange.bind(this, "teal")} className="item ui teal basic button">Teal</div>
            <div onClick={this.handlePieceColourChange.bind(this, "blue")} className="item ui blue basic button">Blue</div>
          </div>
        </div>
      </div>
    );
  }
}
