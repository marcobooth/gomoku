import sys
import numpy
from copy import copy
from copy import deepcopy

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

    def __str__(self):
        return self._direction

class Threat:
    def __init__(self, finder, player, locations, moves):
        self._finder = finder
        self._player = player
        self._locations = locations
        self._moves = moves

        self._value = 0
        length = len(self._locations)
        if length == 4:
            self._value = 20000
        elif length == 3:
            self._value = 5
        elif length == 2:
            self._value = 1
        else:
            print "value not able to be calculated... :("
            sys.exit(1)

    def finder(self): return self._finder
    def player(self): return self._player
    def locations(self): return self._locations
    def moves(self): return self._moves
    def value(self): return self._value

    def __str__(self):
        return 'player={}, heuristic={} finder={}, {}, {}'.format(self._player, self.value(), self._finder, self._locations, self._moves)
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
        return row >= 0 and row < BOARD_SIZE and col >= 0 and col < BOARD_SIZE

    @staticmethod
    def add_in_play(old_in_play, board, set_row, set_col):
        """
        Return a new in_play object with the cells around (set_row, set_col)
        added
        """

        new_in_play = copy(old_in_play)

        for row in range(set_row - 2, set_row + 3):
            if row < 0 or row >= BOARD_SIZE: continue

            for col in range(set_col - 2, set_col + 3):
                if col < 0 or col >= BOARD_SIZE: continue

                # only add it if a move hasn't been done there
                if board[row][col] == None:
                    # don't change the parent's information...
                    if new_in_play[row] is old_in_play[row]:
                        new_in_play[row] = copy(old_in_play[row])

                    # add the current row/col to the "in play" cells
                    new_in_play[row][col] = True

        return new_in_play

    # TODO: do we need to take depth into account for the heuristic?
    # NOTE: I tried doing threats=[] but Python insisted on giving it values
    # for previous calls of __init__.
    def __init__(self, board, current_player=True, in_play_cells=0, threats=[]):
        # NOTE: board.board is a 2D array of None, False, and True where True/False
        # are places where moves have been made and correspond to whether the move
        # was made by the maximizing player.

        # NOTE: in_play_cells is a hash table with rows as the top-level
        # attribute value and columns as the second-level attribute. All values
        # of the hash table are True.

        # if stuff is default, calculate some starting values
        winning_threat = None

        if in_play_cells == 0:
            # set up in_play_cells
            in_play_cells = {}

            for row in range(BOARD_SIZE):
                in_play_cells[row] = {}

        self._board = board
        self._current_player = current_player
        self._in_play_cells = in_play_cells
        self._threats = threats
        self._winning_threat = winning_threat

    def move(self, row, col, move_player=None):
        print 'row:', row
        print 'col:', col

        # copy over the board, reusing as much memory as possible
        newBoard = copy(self._board)
        newBoard[row] = copy(self._board[row])

        # put the piece down
        if move_player == None:
            move_player = not self._current_player
        newBoard[row][col] = move_player

        in_play = deepcopy(self._in_play_cells)

        # if we're not initializing the board, remove the place we just
        # played from being "in play"
        if move_player == None:
            del in_play[row][col]

        # add the cells around where the move is
        in_play = self.add_in_play(self._in_play_cells, newBoard, row, col)

        # check to see if we need to add/remove any new threats
        threats = copy(self._threats)

        self.update_threats_around(row, col)

        return Board(newBoard, not self._current_player, in_play, threats)

    def update_threats_around(self, row, col):
        # check to see if we're in a known threat right now

        # if we're not in a threat we know about, check to see if we're
        # in one going either direction

        # check to see if we disrupt any of the threats that could expand here

        for finder in self.threat_finders:
            if not self.within_bounds(row, col): continue

            moves = []
            prev_row, prev_col = finder.backwards(row, col)
            if self.within_bounds(prev_row, prev_col):
                prev_value = board[prev_row][prev_col]

                # check if this is already a part of a threat
                # in this direction
                # TODO: treat new lines after skipped cells as new threats?
                if prev_value == threat_player:
                    continue
                elif prev_value == None:
                    # ... or if it's somewhere we can move
                    moves.append((prev_row, prev_col))

            seek_row, seek_col = row, col
            locations = [(seek_row, seek_col)]

            while len(locations) <= 5:
                # iterate the seek row/col
                seek_row, seek_col = finder.forwards(seek_row, seek_col)

                if self.within_bounds(seek_row, seek_col):
                    board_value = board[seek_row][seek_col]
                    if board_value == threat_player:
                        locations.append((seek_row, seek_col))
                    elif board_value == None:
                        # TODO: check for disconnected threats
                        moves.append((seek_row, seek_col))

                        break
                    # else board_value == !threat_player so just continue
                    # on with our life
                else:
                    break

            if len(locations) <= 1: continue

            found_threat = Threat(finder, threat_player, locations, moves)

            # if there's a winner deal with that
            if len(locations) == 5:
                winning_threat = found_threat

            # TODO: don't add it if there's no room for expansion
            # (can't fit 5 there)
            threats.append(found_threat)

    def heuristic(self):
        multipliers = [-1, 1]

        return sum([threat.value() * multipliers[int(threat.player())] for threat in self._threats])

    def get_winner(self):
        return self._winning_threat

    def get_moves(self):
        # re-sort the threats so that we discover the best moves first
        self.threats.sort(key=lambda x: x.value(), reverse=True)

        # keep track of these so we can check non-threat moves afterwards
        in_play = deepcopy(self._in_play_cells)

        moves = []

        for threat in self.threats:
            moves.extend(threat.moves())

# TODO: this has to return the last move to the main so we know what the best
# move is
def alphabeta(board, dive_depth, alpha, beta, current_player):
    if dive_depth == 0 or board.get_winner():
        return board.calculateHeuristic()

    value = float('-inf') if current_player else float('inf')

    for move in board.get_moves():
        # create the new board with the move
        newBoard = board.move(move.row, move.col)

        if current_player:
            value = max(value, alphabeta(move, dive_depth - 1, alpha, beta, False))
            alpha = max(alpha, value)
        else:
            value = min(value, alphabeta(move, dive_depth - 1, alpha, beta, True))
            beta = min(beta, value)

        # stop if it's not worth looking at this position anymore
        if beta <= alpha:
            break

    return value

def gomoku(maxPlayerChar, move_row, move_col, boardStrings):
    board = Board([[None for cell in range(BOARD_SIZE)] for row in range(BOARD_SIZE)])

    # make a move for each of the filled-in cells on the board
    for rowIndex, row in enumerate(boardStrings):
        for colIndex, cell in enumerate(row):
            if cell == '.':
                continue

            player = cell == maxPlayerChar
            board = board.move(rowIndex, colIndex, player)

    # make the move...
    board = board.move(move_row, move_col)

    winner = board.get_winner()
    if winner:
        if winner.player():
            print "Player wins!"
        else:
            print "Opponent wins!"
    else:
        print "Searching for best move..."

        # look for the best move with Alpha-Beta pruning
        bestMove = alphabeta(board, 3, float('-inf'), float('inf'), True)
        print "Best move [0-indexed (row, col)]: ({:>2}, {:>2})".format(bestMove[0], bestMove[1])

# Example to run:
# python engine.py w 5 6 "..................." "....wwb............" [...]
if __name__ == '__main__':
    print sys.argv
    gomoku(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4:])
