import React from 'react'
import { connect } from 'react-redux'

export const OtherBoardsContainer = () => {
  return (
    <div>
      
    </div>
  );
}

const mapStateToProps = (state) => {
  // return state.getIn("clients", "tfleming");
}
export default connect(mapStateToProps, null)(OtherBoardsContainer)
