import React from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'underscore'

export const CreateGame = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    if (!this.props.games) {
      return ( <div>Loading...</div> )
    }

    return (
      <ul>
        {this.props.games.entrySeq().map(([key, value], index) => {
          return <li key={index}>
            {key}: {value.get('clients').size} player{value.get('clients').size > 1 ? "s" : ""}
          </li>
        })}
      </ul>
    )
  }
});

function mapStateToProps(state) {
  console.log("state.toJS():", state.toJS());

  return {
    games: state.get('games')
  }
}

export const CreateGameContainer = connect(mapStateToProps)(CreateGame);
