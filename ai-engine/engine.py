from copy import copy

BOARD_SIZE = 19

class Board(object):
	# TODO: do we need to take depth into account for the heuristic?
	def __init__(self, board, maxPlayerColor, maximizingPlayer=True, inPlayCells=0, threats):
		# if stuff is default, calculate some starting values
		if inPlayCells == 0:
			# set up inPlayCells
			inPlayCells = {}

			for i in range(BOARD_SIZE):
				inPlayCells[i] = {}

			# set up threats
			for row in range(BOARD_SIZE - 5):
				for col in range(BOARD_SIZE):
					player = board[row][col]

					# There's likely a more beautiful way of running through this logic
					if col < BOARD_SIZE - 5:
						# look right
						if board[row][col] and (row == 0 or board[row - 1][col]) != player and \
								all(board[lrow][col] == player for lrow in range(row + 1, row + 5)):
							# found one going right
							print 'found one going right'

						# look down
						if board[row][col] and (col == 0 or board[row][col - 1]) != player and \
								all(board[row][lcol] == player for lcol in range(col + 1, col + 5)):
							# found one going down
							print 'found one going down'

						# look down right
						if board[row][col] and \
								(row == 0 or col == 0 or board[row - 1][col - 1] != player) and \
								all(board[row + delta][col + delta] == player for delta in range(1, 5)):
							print 'found one going down right'

					if col >= 4:
						# look up right
						if board[row][col] and \
								(row == 0 or col == BOARD_SIZE - 1 or board[row - 1][col + 1] != player) and \
								all(board[row + delta][col - delta] == player for delta in range(1, 5)):
							print 'found one going up right'

		this.board = board
		this.maxPlayerColor = maxPlayerColor
		this.maximizingPlayer = maximizingPlayer
		this.inPlayCells = inPlayCells
		this.threats = threats

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

		threats = this.threats
		# TODO: check to see if we need to add any threats

		return Board(newBoard, this.maxPlayerColor, !this.maximizingPlayer, inPlayCells, threats)

	def heuristic(self):
		# TODO: return something about the threats
		# return the heuristic for this board

	def getChildren(self):
		return [move(self, row, col,

		for yop in a:
     		for hi in a[yop]:
             		print str(yop) + " " + str(hi)
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

board = Board([['' for i in range(BOARD_SIZE)] for i in range(BOARD_SIZE)], 'w', True)
