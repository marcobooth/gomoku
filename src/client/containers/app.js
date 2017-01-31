import React from 'react'
import { Tetris } from '../components/components'
import Messages from './messages'
import CreateMessage from './createMessage'
import { connect } from 'react-redux'
import _ from "underscore"


const App = () => {
  // <Messages />
  // <CreateMessage />
  return (
    <div>
      <Tetris />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    // messages: state.messages
  }
}
export default connect(mapStateToProps, null)(App)
