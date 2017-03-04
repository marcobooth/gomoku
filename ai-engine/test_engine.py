import unittest
from engine import *
from copy import deepcopy

class TestGomokuENgine(unittest.TestCase):

    empty_board_cells = [
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
        [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
    ]

    def test_blank_init(self):
        board = Board([[None for i in range(BOARD_SIZE)] for i in range(BOARD_SIZE)])
        self.assertEqual(len(board._in_play_cells), BOARD_SIZE)

        for row, row_values in board._in_play_cells.iteritems():
            self.assertEqual(row_values, {})

    def test_single_blocked_two(self):
        cells = deepcopy(self.empty_board_cells)
        cells[0][0] = True
        cells[0][1] = True
        board = Board(cells)

        self.assertEqual(board._in_play_cells[0], {2: True, 3: True})
        self.assertEqual(board._in_play_cells[1], {0: True, 1: True, 2: True, 3: True})
        self.assertEqual(board._in_play_cells[2], {0: True, 1: True, 2: True, 3: True})

        self.assertEqual(board.get_winner(), None)
        self.assertEqual(board.heuristic(), 1)
        self.assertEqual(len(board._threats), 1)

        threat = board._threats[0]
        self.assertEqual(threat._finder._direction, "right")
        self.assertEqual(threat.player(), True)
        self.assertEqual(len(threat.locations()), 2)
        self.assertEqual(len(threat.moves()), 1)
        self.assertEqual(threat.locations()[0], (0, 0))
        self.assertEqual(threat.locations()[1], (0, 1))
        self.assertEqual(threat.moves()[0], (0, 2))

        # now check the same thing with the other player
        cells[0][0] = False
        cells[0][1] = False
        board = Board(cells, True)

        self.assertEqual(len(board._threats), 1)
        self.assertEqual(board._threats[0].player(), False)
        self.assertEqual(board.heuristic(), -1)

if __name__ == '__main__':
    unittest.main()
