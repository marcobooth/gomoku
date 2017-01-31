import React from 'react'
import BoardContainer from '../containers/BoardContainer'
import {OtherBoardsContainer} from '../containers/OtherBoardsContainer'

export const Tetris = React.createClass({
  shouldComponentUpdate() {
    return false;
  },

  render() {
    return (
      <div>
        <BoardContainer/>
        <OtherBoardsContainer/>
      </div>
    )
  }
});

export const Board = function (args) {
  let squareSize = 30;

  if (!args.board) {
    return (
      <div />
    )
  }

  console.log("args:", args);

  return (
    <div style={{width: `${squareSize * 10}px`, height: `${squareSize * 20}px`}}>
      {args.board.map((row, index) => {
        return <BoardRow row={row} squareSize={squareSize} key={index} />
      })}
    </div>
  )
}

export const BoardRow = ({ row, squareSize }) => {
  console.log("row:", row);

  let boxStyle = {
    height: `${squareSize}px`,
    width: `${squareSize}px`,
  }

  return (
    <div style={{display: "flex"}}>
      {row.map((squareColor, index) => {
        let style = {
          "background-color": `#${squareColor}`,
          ...boxStyle
        }

        console.log("style:", style);

        return <div style={style} key={index}></div>
      })}
    </div>
  )
}
