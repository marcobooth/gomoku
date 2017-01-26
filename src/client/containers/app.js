import React from 'react'
import Messages from './messages'
import CreateMessage from './createMessage'
import { connect } from 'react-redux'
import _ from "underscore"


const App = () => {
  return (
    <div>
      <Messages />
      <CreateMessage />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    // messages: state.messages
  }
}
export default connect(mapStateToProps, null)(App)
