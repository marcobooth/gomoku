from copy import copy
import numpy

BOARD_SIZE = 19

class Board(object):
    # this is a nice listing of the four ways to find threats
    threat_finders = [
        {
            forwards: lambda row, col: (row + 1, col),
            backwards: lambda row, col: (row - 1, col),
            row_lower: 0,
            row_upper: BOARD_SIZE - 4,
            col_lower: 0,
            col_upper: BOARD_SIZE,
        },
        {
            forwards: lambda row, col: (row + 1, col + 1),
            backwards: lambda row, col: (row - 1, col - 1),
            row_lower: 0,
            row_upper: BOARD_SIZE - 4,
            col_lower: 0,
            col_upper: BOARD_SIZE - 4,
        },
        {
            forwards: lambda row, col: (row + 1, col - 1),
            backwards: lambda row, col: (row - 1, col + 1),
            row_lower: 4,
            row_upper: BOARD_SIZE,
            col_lower: 0,
            col_upper: BOARD_SIZE - 4,
        },
        {
            forwards: lambda row, col: (row, col + 1),
            backwards: lambda row, col: (row, col - 1),
            row_lower: 0,
            row_upper: BOARD_SIZE,
            col_lower: 0,
            col_upper: BOARD_SIZE - 4,
        },
    ]

    @staticmethod
    def within_bounds(bounds, row, col):
        return row >= bounds.row_lower and row < bounds.row_upper and \
                col >= bounds.col_lower and col < bounds.col_upper

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
                    for finder in threat_finders:
                        if not within_bounds(finder, row, col): continue

                        # check if this is already a part of a threat
                        # in this direction
                        prev_row, prev_col = finder.backwards(row, col)
                        if within_bounds(finder, prev_row, prev_col) and \
                                board[prev_row][prev_col] == maximizingPlayer:
                            continue

                        threat_length = 0
                        seek_row, seek_col = row, col
                        while threat_length < 5:
                            # iterate the seek row/col
                            seek_row, seek_col = finder.forwards(seek_row, seek_col)
                            if board[seek_row][seek_col] != maximizingPlayer:
                                break
                            threat_length++

                        # TODO: check for disconnected 3/4-threats
                        # if threat_length < 4:
                        #     prev_row, prev_col = finder.backwards(row, col)

                        found_threat = {
                            length: threat_length,
                            player: maximizingPlayer,
                        }

                        if threat_length == 5:
                            self.winning_threat = found_threat

                        threats.push(found_threat)

        self.board = board
        self.maximizingPlayer = maximizingPlayer
        self.inPlayCells = inPlayCells
        self.threats = threats

    def move(self, row, col):
        # copy over the board, reusing as much memory as possible
        newBoard = copy(oldBoard.board)
        newBoard[row] = copy(oldBoard.board[row])
        newBoard[row][col] = not self.maximizingPlayer

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

        # check to see if we need to add any new threats
        threats = copy(self.threats)

        return Board(newBoard, self.maxPlayerColor, not self.maximizingPlayer, inPlayCells, threats)

    def heuristic(self):
        # TODO: return something about the threats
        # return the heuristic for this board
        return 0

    def hasWinner(self):
        return self.winning_threat

    def getMoves(self):
        # TODO
        return []

# TODO: this has to return the last move to the main so we know what the best
# move is
def alphabeta(board, diveDepth, alpha, beta, maximizingPlayer):
    if diveDepth == 0 or board.hasWinner():
        return board.calculateHeuristic()

    value = float('-inf') if maximizingPlayer else float('inf')

    for move in board.getMoves():
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
