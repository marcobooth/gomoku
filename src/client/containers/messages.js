import React from 'react'
import { connect } from 'react-redux'
import _ from "underscore"


const Messages = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => {
        return <h1 key={index}>{message}</h1>;
      })}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  }
}
export default connect(mapStateToProps, null)(Messages)
