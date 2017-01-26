import React from 'react'
import { connect } from 'react-redux'
import _ from "underscore"

const CreateMessage = () => {
  return (
    <div>
      <form action="">
        Message:<br/>
        <input type="text" name="newMessage"/>
        <input type="submit" value="Submit"/>
      </form>
    </div>
  );
}

export default CreateMessage
