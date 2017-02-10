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
        <div>
          <form onSubmit={e => {
            e.preventDefault()
            if (!input.value.trim()) {
              return
            }
            this.props.dispatch(addMessage(roomName, username, input.value))
            input.value = ''
          }}>
            Message:<br/>
          <input type="text" ref={node =>
              input = node
            }/>
            <input type="submit" value="Submit"/>
          </form>
        </div>

        {this.props.messages ?
          this.props.messages.map((message, index) => {
            return <h1 key={index}>{message}</h1>;
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
