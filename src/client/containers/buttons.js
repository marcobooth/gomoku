import React from 'react'
import { connect } from 'react-redux'
import _ from "underscore"
import { movePiece, startGame, endGame } from "../actions/allActions"

const Buttons = ({ dispatch }) => {
  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        dispatch(movePiece('down'))
      }}>
        <input type="submit" value="Down"/>
      </form>
      <form onSubmit={e => {
        e.preventDefault()
        dispatch(movePiece('left'))
      }}>
        <input type="submit" value="Left"/>
      </form>
      <form onSubmit={e => {
        e.preventDefault()
        dispatch(movePiece('right'))
      }}>
        <input type="submit" value="Right"/>
      </form>
      <form onSubmit={e => {
        e.preventDefault()
        dispatch(startGame())
      }}>
        <input type="submit" value="Start Game"/>
      </form>
      <form onSubmit={e => {
        e.preventDefault()
        dispatch(endGame())
      }}>
        <input type="submit" value="End Game"/>
      </form>
    </div>
  );
}

export default connect()(Buttons)
