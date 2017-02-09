import React from 'react'

export default React.createClass({
  render() {
    let { board, squareSize } = this.props

    let boxStyle = {
      height: `${squareSize}px`,
      width: `${squareSize}px`,
    }

    return (
      <div style={{display: 'inline-block', width: `${squareSize * 10}px`, height: `${squareSize * 20}px`}}>
        {board.entrySeq().map(([key, value], index) => {
          return <div className='row' key={index} style={{display: 'flex'}}>
            {value.entrySeq().map(([key, squareColor], index) => {
              let style = {
                "backgroundColor": squareColor ? `#${squareColor}` : null,
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
