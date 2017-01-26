import React from 'react'
import { connect } from 'react-redux'
import _ from "underscore"
import { addMessage } from "../actions/addMessage"

const CreateMessage = ({ dispatch }) => {
  let input

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(addMessage(input.value))
        input.value = ''
      }}>
        Message:<br/>
      <input type="text" ref={node =>
          input = node
        }/>
        <input type="submit" value="Submit"/>
      </form>
    </div>
  );
}

export default connect()(CreateMessage)
