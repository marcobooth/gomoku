from copy import copy
import numpy

BOARD_SIZE = 19

class Board(object):
    threatFindingMutators = [
        lambda row, col: (row + 1, col),
        lambda row, col: (row + 1, col + 1),
        lambda row, col: (row + 1, col - 1),
        lambda row, col: (row, col - 1),
    ]

    # TODO: do we need to take depth into account for the heuristic?
    def __init__(self, board, maximizingPlayer=True, inPlayCells=0, threats=[]):
        # NOTE: board.board is a 2D array of None, False, and True where True/False
        # are places where moves have been made and correspond to whether the move
        # was made by the maximizing player.

        # NOTE: inPlayCells is a 2D hash table with rows as the top-level
        # attribute value and columns as the second-level attribute. All values
        # of the hash table are True.

        # if stuff is default, calculate some starting values
        if inPlayCells == 0:
            # set up inPlayCells
            inPlayCells = {}

            for i in range(BOARD_SIZE):
                inPlayCells[i] = {}

            # find all the threats from scratch
            for row in range(BOARD_SIZE):
                for col in range(BOARD_SIZE):
                    player = board[row][col]





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

        self.board = board
        self.maximizingPlayer = maximizingPlayer
        self.inPlayCells = inPlayCells
        self.threats = threats

    def move(self, row, col):
        # copy over the board, reusing as much memory as possible
        newBoard = copy(oldBoard.board)
        newBoard[row] = copy(oldBoard.board[row])
        newBoard[row][col] = !this.maximizingPlayer

        # add to the in play cells
        inPlayCells = copy(self.inPlayCells)

        # remove the place we just played from being "in play"
        del inPlayCells[row][col]

        # add the cells around where the move was
        for currentRow in range(row - 2, row + 3):
            if row < 0 or row > BOARD_SIZE: continue

            for currentCol in range(col - 2, col + 3):
                if col < 0 or col > BOARD_SIZE: continue

                # only add it if a move hasn't been done there
                if board[currentRow][currentCol] != None:
                    # don't change the parent's information...
                    if inPlayCells[currentRow] is self.inPlayCells[currentRow]:
                        inPlayCells[currentRow] = copy(self.inPlayCells[currentRow])

                    # add the current row/col to the "in play" cells
                    inPlayCells[currentRow][currentCol] = True

        threats = self.threats
        # TODO: check to see if we need to add any threats

        return Board(newBoard, self.maxPlayerColor, !self.maximizingPlayer, inPlayCells, threats)

    def heuristic(self):
        # TODO: return something about the threats
        # return the heuristic for this board

# TODO: this has to return the last move to the main so we know what the best
# move is
def alphabeta(board, diveDepth, alpha, beta, maximizingPlayer):
    if diveDepth == 0 or board.hasWinner():
        return board.calculateHeuristic()

    value = maximizingPlayer ? float('-inf') : float('inf')

    for move of board.getMoves():
        # create the new board with the move
        newBoard = board.move(move.row, move.col)

        if maximizingPlayer:
            value = max(value, alphabeta(move, diveDepth - 1, alpha, beta, False))
            alpha = max(alpha, value)
        else:
            value = min(value, alphabeta(move, diveDepth - 1, alpha, beta, True))
            beta = min(beta, value)

        # stop if it's not worth looking at this position anymore
        if beta <= alpha:
            break

    return value

def main():
    # TODO: read in arguments, create the first board, pass that into alphabeta()

    # create the first board from scratch (normally created with board.move())
    # might not work yet
    board = Board([[None for i in range(BOARD_SIZE)] for i in range(BOARD_SIZE)])

    # check to see if there's already a winner and act accordingly
    if board.hasWinner():
        # do something with the winner

    # look for the best move with Alpha-Beta pruning
    alphabeta(board, 3, float('-inf'), float('inf'), True)

if __name__ == '__main__':
    main()
