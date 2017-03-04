from copy import copy
import numpy
import sys

BOARD_SIZE = 19

class ThreatFinder:
    def __init__(self, direction, forwards, backwards):
        self._direction = direction
        self._forwards = forwards
        self._backwards = backwards

    def backwards(self, row, col):
        return self._backwards(row, col)

    def forwards(self, row, col):
        return self._forwards(row, col)

class Threat:
    def __init__(self, direction, row, col, length, player):
        self._direction = direction
        self._row = row
        self._col = col
        self._length = length
        self._player = player

    def __str__(self):
        return '{:10} ({:2}, {:2}) len = {} player = {}'.format(self._direction, self._row, self._col, self._length, self._player)
        # return self._direction + '(' + str(self._row) + ', ' + str(self._col) + ') for ' + str(self._length) + ', player = ' + str(self._player)

class Board:

    # this is a nice listing of the four ways to find threats
    threat_finders = [
        ThreatFinder('down', lambda row, col: (row + 1, col),
                    lambda row, col: (row - 1, col)),
        ThreatFinder('down-right', lambda row, col: (row + 1, col + 1),
                    lambda row, col: (row - 1, col - 1)),
        ThreatFinder('up-right', lambda row, col: (row + 1, col - 1),
                    lambda row, col: (row - 1, col + 1)),
        ThreatFinder('right', lambda row, col: (row, col + 1),
                    lambda row, col: (row, col - 1)),
    ]

    @staticmethod
    def within_bounds(row, col):
        print BOARD_SIZE
        return row >= 0 and row < BOARD_SIZE and col >= 0 and col < BOARD_SIZE

    # TODO: do we need to take depth into account for the heuristic?
    def __init__(self, board, max_player=True, _in_play_cells=0, threats=[]):
        # NOTE: board.board is a 2D array of None, False, and True where True/False
        # are places where moves have been made and correspond to whether the move
        # was made by the maximizing player.

        # NOTE: _in_play_cells is a 2D hash table with rows as the top-level
        # attribute value and columns as the second-level attribute. All values
        # of the hash table are True.

        # if stuff is default, calculate some starting values
        if _in_play_cells == 0:
            # set up _in_play_cells
            _in_play_cells = {}

            for i in range(BOARD_SIZE):
                _in_play_cells[i] = {}

            # find all the threats from scratch
            for row in range(BOARD_SIZE):
                for col in range(BOARD_SIZE):
                    # don't bother with cells that aren't filled in
                    if board[row][col] == None: continue

                    for finder in self.threat_finders:
                        if not self.within_bounds( row, col): continue

                        # check if this is already a part of a threat
                        # in this direction
                        prev_row, prev_col = finder.backwards(row, col)
                        if self.within_bounds( prev_row, prev_col) and \
                                board[prev_row][prev_col] == max_player:
                            continue

                        threat_length = 1
                        seek_row, seek_col = row, col
                        while threat_length <= 5:
                            # iterate the seek row/col
                            seek_row, seek_col = finder.forwards(seek_row, seek_col)
                            print seek_row, seek_col
                            print (not self.within_bounds(seek_row, seek_col))
                            if (not self.within_bounds(seek_row, seek_col)) or \
                                    board[seek_row][seek_col] != max_player:
                                break
                            threat_length += 1

                        if threat_length <= 1: continue

                        # TODO: check for disconnected 3/4-threats
                        # if threat_length < 4:
                        #     prev_row, prev_col = finder.backwards(row, col)

                        found_threat = Threat(finder._direction, row, col, threat_length, max_player)

                        if threat_length == 5:
                            self.winning_threat = found_threat

                        threats.append(found_threat)

        self.board = board
        self._max_player = max_player
        self._in_play_cells = _in_play_cells
        self._threats = threats
        self.winning_threat = None

    def move(self, row, col):
        # copy over the board, reusing as much memory as possible
        newBoard = copy(oldBoard.board)
        newBoard[row] = copy(oldBoard.board[row])
        newBoard[row][col] = not self._max_player

        # add to the in play cells
        _in_play_cells = copy(self._in_play_cells)

        # remove the place we just played from being "in play"
        del _in_play_cells[row][col]

        # add the cells around where the move was
        for currentRow in range(row - 2, row + 3):
            if row < 0 or row > BOARD_SIZE: continue

            for currentCol in range(col - 2, col + 3):
                if col < 0 or col > BOARD_SIZE: continue

                # only add it if a move hasn't been done there
                if board[currentRow][currentCol] != None:
                    # don't change the parent's information...
                    if _in_play_cells[currentRow] is self._in_play_cells[currentRow]:
                        _in_play_cells[currentRow] = copy(self._in_play_cells[currentRow])

                    # add the current row/col to the "in play" cells
                    _in_play_cells[currentRow][currentCol] = True

        # check to see if we need to add any new threats
        threats = copy(self._threats)

        return Board(newBoard, not self._max_player, _in_play_cells, threats)

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
def alphabeta(board, dive_depth, alpha, beta, max_player):
    if dive_depth == 0 or board.hasWinner():
        return board.calculateHeuristic()

    value = float('-inf') if max_player else float('inf')

    for move in board.getMoves():
        # create the new board with the move
        newBoard = board.move(move.row, move.col)

        if max_player:
            value = max(value, alphabeta(move, dive_depth - 1, alpha, beta, False))
            alpha = max(alpha, value)
        else:
            value = min(value, alphabeta(move, dive_depth - 1, alpha, beta, True))
            beta = min(beta, value)

        # stop if it's not worth looking at this position anymore
        if beta <= alpha:
            break

    return value

def flengeConverter(value):
    if value == "grey":
        return None
    elif value == "red":
        return True
    else:
        return False

def main(maximizingPlayer, point, stringsForBoard):
    basicBoard = []
    for string in stringsForBoard:
        basicBoard.append(string.split(','))

    basicBoard = [[flengeConverter(value) for value in rowValues] for rowValues in basicBoard]

    if not basicBoard:
        basicBoard = Board([[None for i in range(BOARD_SIZE)] for i in range(BOARD_SIZE)])

    print "validMove"
    
    # check to see if there's already a winner and act accordingly
    if board.hasWinner():
        print "winner exists"

        # do something with the winner
    # look for the best move with Alpha-Beta pruning
    # alphabeta(board, 3, float('-inf'), float('inf'), True)

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3:])
