import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class PieceColour extends Component {

  handlePieceColourChange(colour) {
    Meteor.call('games.changePieceColour', this.props.game._id, this.props.currentUser._id, colour);
  }

  componentDidMount() {
    $('.ui.dropdown').dropdown({
    })
  }

  render() {

    let {currentUser, game} = this.props

    if (!currentUser || !(game.p1 === currentUser._id || game.p2 === currentUser._id)) {
      return <div></div>
    }

    let currentPlayerColour
    if (currentUser._id === game.p1) {
      currentPlayerColour = game["p1Colour"]
    } else if (currentUser._id === game.p2) {
      currentPlayerColour = game["p2Colour"]
    }

    return (
      <div className="center">
        Change piece colour:&nbsp;
        <div className="ui inline dropdown">
          <div className="text">{currentPlayerColour.charAt(0).toUpperCase() + currentPlayerColour.slice(1)}</div>
          <i className="dropdown icon"></i>
          <div className="menu">
            <div onClick={this.handlePieceColourChange.bind(this, "red")} className="item" style={{color: 'red'}}>Red</div>
            <div onClick={this.handlePieceColourChange.bind(this, "orange")} className="item" style={{color: 'orange'}}>Orange</div>
            <div onClick={this.handlePieceColourChange.bind(this, "yellow")} className="item" style={{color: 'yellow'}}>Yellow</div>
            <div onClick={this.handlePieceColourChange.bind(this, "olive")} className="item" style={{color: 'olive'}}>Olive</div>
            <div onClick={this.handlePieceColourChange.bind(this, "green")} className="item active" style={{color: 'green'}}>Green</div>
            <div onClick={this.handlePieceColourChange.bind(this, "teal")} className="item" style={{color: 'teal'}}>Teal</div>
            <div onClick={this.handlePieceColourChange.bind(this, "blue")} className="item" style={{color: 'blue'}}>Blue</div>
          </div>
        </div>
      </div>
    );
  }
}
