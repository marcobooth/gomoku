import React from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { placePiece } from "../actions/allActions"
import _ from 'underscore'

export const Game = React.createClass({
  mixins: [PureRenderMixin],

  handleClick(mainKey, secondKey) {
    // e.preventDefault();
    this.props.dispatch(placePiece(mainKey, secondKey))
    console.log("mainKey, secondKey:", mainKey, secondKey);
    console.log('The link was clicked.');
  },

  render: function() {
    if (!this.props.alreadyStarted) {
      return <div className="starting_text">Loading...</div>
    }

    var board =  this.props.board.entrySeq().map(([mainKey, value]) => {
      return <div className="row" key={mainKey} style={{display: 'flex'}}>
        {value.entrySeq().map(([secondKey, value]) => {
          return <div className="dot" style={{background: value}} onClick={() => this.handleClick(mainKey, secondKey)}></div>
        })}

      </div>
        // value.entrySeq().map(([key, value], index) => {
        //   <div>{value2}</div>
        // })
    })
    // make sure it's started
    // if (!this.props.alreadyStarted) {
    //   return ( <div>Go create a game!</div> )
    // }

    // let squareSize = 30
    // let boxStyle = {
    //   height: `${squareSize}px`,
    //   width: `${squareSize}px`,
    // }


    return (
      <div>
        <h3>Welcome to da game</h3>
        {board}
      </div>
    )
  }
});

function mapStateToProps(state, props) {
  console.log("state:", state);
  return {
    board: state.get("board"),
    alreadyStarted: state.get("alreadyStarted")
  }
}

export const GameContainer = connect(mapStateToProps)(Game);
