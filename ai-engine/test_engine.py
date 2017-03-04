import unittest
from engine import *

class TestGomokuENgine(unittest.TestCase):

    def test_blank_init(self):
        board = Board([[None for i in range(BOARD_SIZE)] for i in range(BOARD_SIZE)])
        self.assertEqual(len(board._in_play_cells), BOARD_SIZE)

        for row, row_values in board._in_play_cells.iteritems():
            self.assertEqual(row_values, {})

    def test_threats_from_scratch(self):
        board = Board([
            [True,  True,  True,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  False, False],
            [None,  True,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  False, None,  None,  None ],
            [True,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  False, None,  None,  None,  None ],
            [False, None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
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
            [None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  True,  True,  True,  None ],
            [True,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None ],
            [True,  False, False, None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  None,  False, None,  None,  False, False],
        ])

        for threat in board._threats:
            print threat

if __name__ == '__main__':
    unittest.main()
