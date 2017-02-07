const pieces = [
  {
    "type": "long-straight",
    "color": "EFA124",
    "size": 4,
    "positions": [
      [ {row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3} ],
      [ {row: 3, col: 2}, {row: 2, col: 2}, {row: 1, col: 2}, {row: 0, col: 2} ],
      [ {row: 2, col: 3}, {row: 2, col: 2}, {row: 2, col: 1}, {row: 2, col: 0} ],
      [ {row: 0, col: 1}, {row: 1, col: 1}, {row: 2, col: 1}, {row: 3, col: 1} ],
    ],
  },
  {
    "type": "left-l",
    "color": "4D5DB6",
    "size": 3,
    "positions": [
      [ {row: 0, col: 1}, {row: 1, col: 1}, {row: 2, col: 1}, {row: 2, col: 0} ],
      [ {row: 1, col: 2}, {row: 1, col: 1}, {row: 1, col: 0}, {row: 2, col: 0} ],
      [ {row: 2, col: 1}, {row: 1, col: 1}, {row: 0, col: 1}, {row: 0, col: 2} ],
      [ {row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 0, col: 2} ],
    ],
  },
  {
    "type": "right-l",
    "color": "48A8F0",
    "size": 3,
    "positions": [
      [ {row: 0, col: 1}, {row: 1, col: 1}, {row: 2, col: 1}, {row: 2, col: 2} ],
      [ {row: 1, col: 2}, {row: 1, col: 1}, {row: 1, col: 0}, {row: 0, col: 0} ],
      [ {row: 2, col: 1}, {row: 1, col: 1}, {row: 0, col: 1}, {row: 0, col: 0} ],
      [ {row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 2, col: 2} ],
    ],
  },
  {
    "type": "zag-up",
    "color": "9CD35B",
    "size": 3,
    "positions": [
      [ {row: 1, col: 0}, {row: 1, col: 1}, {row: 0, col: 1}, {row: 0, col: 2} ],
      [ {row: 2, col: 1}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 0, col: 2} ],
      [ {row: 1, col: 2}, {row: 1, col: 1}, {row: 2, col: 1}, {row: 2, col: 0} ],
      [ {row: 0, col: 1}, {row: 1, col: 1}, {row: 1, col: 0}, {row: 2, col: 0} ],
    ],
  },
  {
    "type": "zag-down",
    "color": "D4E754",
    "size": 3,
    "positions": [
      [ {row: 0, col: 0}, {row: 0, col: 1}, {row: 1, col: 1}, {row: 1, col: 2} ],
      [ {row: 2, col: 2}, {row: 1, col: 2}, {row: 1, col: 1}, {row: 0, col: 1} ],
      [ {row: 2, col: 2}, {row: 2, col: 1}, {row: 1, col: 1}, {row: 1, col: 0} ],
      [ {row: 0, col: 0}, {row: 1, col: 0}, {row: 1, col: 1}, {row: 2, col: 1} ],
    ],
  },
  {
    "type": "sombrero",
    "color": "962DAF",
    "size": 3,
    "positions": [
      [ {row: 1, col: 0}, {row: 0, col: 1}, {row: 1, col: 1}, {row: 1, col: 2} ],
      [ {row: 2, col: 1}, {row: 1, col: 2}, {row: 1, col: 1}, {row: 0, col: 1} ],
      [ {row: 1, col: 2}, {row: 2, col: 1}, {row: 1, col: 1}, {row: 1, col: 0} ],
      [ {row: 0, col: 1}, {row: 1, col: 0}, {row: 1, col: 1}, {row: 2, col: 1} ],
    ],
  },
  {
    "type": "square",
    "color": "6C40B7",
    "size": 2,
    "positions": [
      [ {row: 0, col: 0}, {row: 0, col: 1}, {row: 1, col: 0}, {row: 1, col: 1} ],
      [ {row: 1, col: 1}, {row: 0, col: 1}, {row: 1, col: 0}, {row: 0, col: 0} ],
      [ {row: 1, col: 1}, {row: 1, col: 0}, {row: 0, col: 1}, {row: 0, col: 0} ],
      [ {row: 0, col: 0}, {row: 1, col: 0}, {row: 0, col: 1}, {row: 1, col: 1} ],
    ],
  }
]

export default pieces
