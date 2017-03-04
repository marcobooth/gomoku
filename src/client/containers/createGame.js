import React from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'underscore'

export const CreateGame = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    <h1>Active games</h1>
    // if (!this.props.games) {
    //   return ( <div>Loading...</div> )
    // }

    return (
      <div>Hello</div>
    )
  }
});

function mapStateToProps(state) {

  return {
    // games: state.get('games')
  }
}

export const CreateGameContainer = connect(mapStateToProps)(CreateGame);
