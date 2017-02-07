import React from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export const CreateGame = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    console.log("render?");
    return (
      <span>hewlo</span>
    )
  }
});

function mapStateToProps(state) {
  console.log("mapStateToProps state:", state.toJS());

  return {
    games: state.get('games')
  }
}

export const CreateGameContainer = connect(mapStateToProps)(CreateGame);
