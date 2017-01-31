import React from 'react'
import { Board } from '../components/components'
import { connect } from 'react-redux'

const BoardContainer = function (args) {
  // TODO: can we pass args down without this silly bit?
  return (
    <div>
      <Board {...args} />
    </div>
  );
}

const mapStateToProps = (state) => {
  let boardInfo = state.getIn(["clients", "tfleming"])

  if (boardInfo) {
    return state.getIn(["clients", "tfleming"]).toJS()
  } else {
    return {}
  }
}

export default connect(mapStateToProps)(BoardContainer)
