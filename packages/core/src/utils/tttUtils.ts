import { WINNING_COMBINATIONS_1D, WINNING_COMBINATIONS_2D } from "../constants/index.js";

/**
 * Check for a winner in a 1D board (Array of 9 strings)
 * Returns the symbol ('X' or 'O') or null if no winner
 */
export function checkWinner1D(board: string[]): string | null {
  for (const [a, b, c] of WINNING_COMBINATIONS_1D) {
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

/**
 * Check for a winner in a 2D board (string[][])
 * Returns the symbol ('X' or 'O') or null if no winner
 */
export function checkWinner2D(board: (string | null)[][]): string | null {
  for (const combo of WINNING_COMBINATIONS_2D) {
    const first = board[combo[0].row][combo[0].column];
    const second = board[combo[1].row][combo[1].column];
    const third = board[combo[2].row][combo[2].column];

    if (first && first === second && second === third) {
      return first;
    }
  }
  return null;
}

/**
 * Check if the 1D board is full (draw)
 */
export function isDraw1D(board: string[]): boolean {
  return board.every((cell) => cell !== "");
}

/**
 * Check if the 2D board is full (draw)
 */
export function isDraw2D(board: (string | null)[][]): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

/**
 * Converts a 1D board to a 2D board
 */
export function to2D(board: string[]): string[][] {
  const result: string[][] = [];
  for (let i = 0; i < 3; i++) {
    result.push(board.slice(i * 3, i * 3 + 3));
  }
  return result;
}

/**
 * Converts a 2D board to a 1D board
 */
export function to1D(board: string[][]): string[] {
  return board.flat();
}
