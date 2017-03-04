import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Boards } from '../api/boards.js';

class Board extends Component {

  handleClick(mainKey, secondKey) {
    Meteor.call('boards.changePieceColour', this.props.board._id, [mainKey, secondKey], "red");
  }

  renderBoard() {
    if (this.props.board) {
      var renderedBoard = this.props.board.board.map((row, index) => {
        return <div className="row" key={index} style={{display: 'flex'}}>
          {row.map((item, index2) => {
            return <div className="dot" style={{background: item}} onClick={this.handleClick.bind(this, index, index2)}>{item}</div>
          })}
        </div>
      });
      return renderedBoard;
    }
  }

  render() {
    console.log(this.props.board ? this.props.board.board : '');
    return (
      <div className="container">
        <h2>
          Gomoku - Da Game
        </h2>
        <div>
          {this.renderBoard()}
        </div>
      </div>
    );
  }
}

Board.propTypes = {
};

export default createContainer(( params ) => {
  boardId = FlowRouter.getParam("id")
  return {
    board: Boards.findOne(boardId),
  };
}, Board);
