import React from 'react'
import { connect } from 'react-redux'
import { addMessage } from "../actions/allActions"
import _ from "underscore"

const Messages = React.createClass({
  // mixins: [PureRenderMixin],
  render() {
    let {roomName, username } = this.props.params

    let input

    return (
      <div>
        <form onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          this.props.dispatch(addMessage(roomName, username, input.value))
          input.value = ''
        }}>
          <h3 className="title">
            Messages:<br/>
        </h3>
        <div className="message">
          <input type="text" ref={node =>
              input = node
            }/>
        </div>
        </form>

        {this.props.messages ?
          this.props.messages.map((message, index) => {
            return (<div className="message" key={index}>
                    <span className="date_username">{message.get('dateCreated')}</span>
                    <span className="date_username">{message.get('username')}</span>
                    <span className="message_content">{message.get('message')}</span>
                    </div>)
          }) :
          <span>loading...</span>}
      </div>
    );
  }
})

const mapStateToProps = (state, props) => {
  let { roomName } = props.params

  return {
    messages: state.getIn(['games', roomName, 'messages'])
  }
}
export default connect(mapStateToProps)(Messages)
