import React from 'react'

export default React.createClass({
  render() {
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <img className="img-responsive" src={"../../../tetris.png"} alt="logo"/>
        </div>
        {this.props.children}
      </div>
    )
  }
})
