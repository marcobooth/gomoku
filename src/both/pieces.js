function switchRowsCols(positions) {
  return positions.map(({ row, col }) => {
    return {
      row: col,
      col: row
    }
  })
}

function subtractFromSize(positions, size) {
  return positions.map(({ row, col }) => {
    return {
      row: size - 1 - row,
      col: size - 1 - col,
    }
  })
}

function createPositions(initialPositions, size) {
  return [
    initialPositions,
    subtractFromSize(initialPositions, size),
    switchRowsCols(subtractFromSize(initialPositions, size)),
    switchRowsCols(initialPositions),
  ]
}

var initialPositionPieces = [
  {
    "type": "long-straight",
    "color": "EFA124",
    "size": 4,
    "initialPositions": [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ],
  },
  {
    "type": "left-l",
    "color": "4D5DB6",
    "size": 3,
    "initialPositions": [
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 2, col: 0 },
    ],
  },
  {
    "type": "right-l",
    "color": "48A8F0",
    "size": 3,
    "initialPositions": [
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
  },
  {
    "type": "zag-up",
    "color": "9CD35B",
    "size": 3,
    "initialPositions": [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ],
  },
  {
    "type": "zag-down",
    "color": "D4E754",
    "size": 3,
    "initialPositions": [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
  },
  {
    "type": "sombrero",
    "color": "962DAF",
    "size": 3,
    "initialPositions": [
      { row: 1, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
  },
  {
    "type": "square",
    "color": "6C40B7",
    "size": 2,
    "initialPositions": [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
  }
]

const pieces = initialPositionPieces.map(piece => {
  // add the other 3 positions instead of just the initial ones
  piece.positions = createPositions(piece.initialPositions, piece.size);

  delete piece.initialPositions;

  return piece;
})

export default pieces
