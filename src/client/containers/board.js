import React from 'react'

export default React.createClass({
  render() {
    let { board, squareSize, colourRed } = this.props

    let boxStyle = {
      height: `${squareSize}px`,
      width: `${squareSize}px`,
    }

    return (
      <div style={{display: 'inline-block', width: `${squareSize * 10}px`, height: `${squareSize * 20}px`}}>
        {board.entrySeq().map(([key, value], index) => {
          return <div key={index} style={{display: 'flex'}}>
            {value.entrySeq().map(([key, squareColor], index) => {
              let style = {
                "backgroundColor": this.props.colourRed ? (squareColor ? `#FF0000` : null) : (squareColor ? `#${squareColor}` : null),
                ...boxStyle
              }

              return <div style={style} key={index}></div>
            })}
          </div>
        })}
      </div>
    )
  }
})
