import React from 'react'

function Winner(props) {
  if (props.game.status != "winner")
    return null

  if (props.currentUser._id === props.game._id)
    return <h1 className="ui block center aligned header">You have WON the game</h1>

  return <h1 className="ui block center aligned header">You have LOST the game</h1>
}

export default Winner
