import React from 'react'
import { connect } from 'react-redux'
import _ from "underscore"

const Messages = React.createClass({
  // mixins: [PureRenderMixin],
  render() {
    return (
      <div>
        {this.props.messages ?
          this.props.messages.map((message, index) => {
            return <h1 key={index}>{message}</h1>;
          }) :
          <span>loading...</span>}
      </div>
    );
  }
})

const mapStateToProps = (state) => {
  return {
    messages: state.get('messages')
  }
}
export default connect(mapStateToProps)(Messages)
