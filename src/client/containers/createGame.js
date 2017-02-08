import React from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'underscore'

export const CreateGame = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    <h1>Active games</h1>

    if (!this.props.games) {
      return ( <div>Loading...</div> )
    }

    // show a message if there's nothing there
    if (!this.props.games.keySeq().size) {
      return (
        <div>No games active at this time</div>
      )
    }

    return (
      <ul>
        {this.props.games.entrySeq().map(([key, value], index) => {
          let clientCount = value.get('clients').size
          let masterUsername = value.getIn(['game', 'masterUsername'])

          return <li key={index}>
            {key}: {clientCount} player{clientCount > 1 ? "s" : ""}:
            {value.getIn(['game', 'alreadyStarted']) ? "started!" : `Waiting for ${masterUsername} to start...`}
          </li>
        })}
      </ul>
    )
  }
});

function mapStateToProps(state) {

  return {
    games: state.get('games')
  }
}

export const CreateGameContainer = connect(mapStateToProps)(CreateGame);
