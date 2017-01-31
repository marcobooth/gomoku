import React from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export const BoardRow = ({ row, squareSize }) => {
  // console.log("row:", row);

  let boxStyle = {
    height: `${squareSize}px`,
    width: `${squareSize}px`,
  }

  return (
    <div style={{display: "flex"}}>
      {row.map((squareColor, index) => {
        let style = {
          "backgroundColor": squareColor ? `#${squareColor}` : null,
          ...boxStyle
        }

        return <div style={style} key={index}></div>
      })}
    </div>
  )
}
