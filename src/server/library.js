export function verticalWinningState(board, player, point) {
  let currentColour = (player == 1 ? "black" : "red")
  for (var i = 1; i < 5; i++) {
    if (board[point[0] + i] == undefined || board[point[0] + i][point[1]] == undefined || board[point[0] + i][point[1]] != currentColour) {
      return 0
    }
  }
  return 1
}

export function horizontalWinningState(board, player, point) {
  let currentColour = (player == 1 ? "black" : "red")
  for (var i = 1; i < 5; i++) {
    if (board[point[0]][point[1] + i] == undefined || board[point[0]][point[1] + i] != currentColour) {
      return 0
    }
  }
  return 1
}

export function rightDiagonalWinningState(board, player, point) {
  let currentColour = (player == 1 ? "black" : "red")
  for (var i = 1; i < 5; i++) {
    if (board[point[0] + i] == undefined || board[point[0] + i][point[1] + i] == undefined || board[point[0] + i][point[1] + i] != currentColour) {
      return 0
    }
  }
  return 1
}

export function leftDiagonalWinningState(board, player, point) {
  let currentColour = (player == 1 ? "black" : "red")
  for (var i = 1; i < 5; i++) {
    if (board[point[0] + i] == undefined || board[point[0] + i][point[1] - i] == undefined || board[point[0] + i][point[1] - i] != currentColour) {
      return 0
    }
  }
  return 1
}
