class Board(object):
	def __init__(self, oldBoard, row, col, player):
		# create new board/game state from old board and move
		# have a constant starting board delcared somewhere

	def heuristic():
		# return the heuristic for this board

	def getChildren():
		# return a bunch of new boards that are children of this board

class Game(object):
	def __init__(self):
		# ?

	def alphabeta(node, depth, alpha, beta, maximizingPlayer):
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
