from copy import copy

BOARD_SIZE = 19

class Board(object):
	# TODO: do we need to take depth into account for the heuristic?
	def __init__(self, board, inPlayCells=0, maxPlayerThreats=0, minPlayerThreats=0, maximizingPlayer=True):
		# set default inPlayCells if necessary
		if inPlayCells == 0:
			inPlayCells = {}

			for i in range(BOARD_SIZE):
				inPlayCells[i] = {}

		# calculate min/max threats if necessary
		if maxPlayerThreats == 0:
			# I AM HERE

		this.board = board
		this.inPlayCells = inPlayCells
		this.maxPlayerThreats = maxPlayerThreats
		this.minPlayerThreats = minPlayerThreats

	def move(self, row, col, blackOrWhite):
		# copy over the board, reusing as much memory as possible
		newBoard = copy(oldBoard.board)
		newBoard[row] = copy(oldBoard.board[row])
		newBoard[row][col] = blackOrWhite

		# add to the in play cells
		inPlayCells = copy(this.inPlayCells)

		# remove the place we just played
		del inPlayCells[row][col]

		# add the cells around where the move was
		for currentRow in range(row - 2, row + 3):
			if row < 0 or row > BOARD_SIZE: continue

			for currentCol in range(col - 2, col + 3):
				if col < 0 or col > BOARD_SIZE: continue

				# add the current row/col to the in play cells
				if not board[currentRow][currentCol]:
					inPlayCells[currentRow][currentCol] = True

		minPlayerThreats = this.minPlayerThreats
		maxPlayerThreats = this.maxPlayerThreats
		# TODO: check to see if we need to add any threats

		return Board(newBoard, maxPlayerThreats, minPlayerThreats)

	def heuristic(self):
		# TODO: return something about the threats
		# return the heuristic for this board

	def getChildren(self):
		return [move(self, row, col,

		for yop in a:
...     for hi in a[yop]:
...             print str(yop) + " " + str(hi)
		return []
		# return a bunch of new boards that are children of this board

	def alphabeta(self, depth, alpha, beta, maximizingPlayer):
		if depth == 0 or hasWinner(node):
			return calculateHeuristic(node)

		if maximizingPlayer:
			value = float('-inf')
			for child of getChildren(node):
				value = max(value, alphabeta(child, depth - 1, alpha, beta, False))
				alpha = max(alpha, value)
				if beta <= alpha:
					break
			return value
		else:
			value = float('inf')
			for child of getChildren(node):
				value = min(value, alphabeta(child, depth - 1, alpha, beta, True))
				beta = min(beta, value)
				if (beta <= alpha):
					break
			return value

board = Board([['' for i in range(BOARD_SIZE)] for i in range(BOARD_SIZE)])
