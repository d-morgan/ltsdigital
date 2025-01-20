/**
 * @param board - 1D array of length 9
 * @param player - 'X' or 'O'
 */
export function checkWin(board: (string | null)[], player: 'X' | 'O'): boolean {
  const winningCombinations = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];

  return winningCombinations.some(([a, b, c]) => {
    return board[a] === player && board[b] === player && board[c] === player;
  });
}
