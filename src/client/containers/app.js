import React from 'react'
import { BoardContainer } from './board'
import Messages from './messages'
import Buttons from './buttons'
import CreateMessage from './createMessage'
import { connect } from 'react-redux'
import _ from "underscore"


const App = () => {
  // <Messages />
  // <CreateMessage />
  return (
    <div>
      <BoardContainer />
      <Buttons />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    // messages: state.messages
  }
}
export default connect(mapStateToProps)(App)
