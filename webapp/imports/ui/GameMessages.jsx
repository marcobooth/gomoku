import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Messages } from '../api/collections.js';

class GameMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    // TODO Why are we dong this? Explore bind
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCreateMessages = this.handleCreateMessages.bind(this);
  }

  handleCreateMessages(text) {
    Meteor.call('messages.insert', this.props.gameId, text);
  }

  renderMessages() {
    var renderedMessages = this.props.messages.map((message, index) => {
      return (
        <div className="comment" key={index}>
          <div className="content">
            <a className="author">{ message.username }</a>
            <div className="metadata">
              <span className="date">{ message.dateCreated.toLocaleTimeString() }</span>
            </div>
            <div className="text">
              { message.text }
            </div>
          </div>
        </div>
      )
    })
    return renderedMessages
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.handleCreateMessages(this.state.value)
    this.setState({value: ''});
    event.preventDefault();
  }

  render() {
    return (
      <div className="ui comments">
        <h3 className="ui dividing header">Comments</h3>
        { this.renderMessages() }
        <form className="ui reply form" onSubmit={this.handleSubmit}>
          <label>
            Message:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>

          <button type="submit" className="ui blue labeled submit icon button">
            <i className="icon edit"></i> Add Reply
          </button>
        </form>
      </div>
    )
  }
}

Messages.propTypes = {
};

export default createContainer(() => {
  gameId = FlowRouter.getParam("_id")
  return {
    gameId,
    messages: Messages.find({ gameId }).fetch(),
    currentUser: Meteor.user(),
  };
}, GameMessages);
