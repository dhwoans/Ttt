import { WINNING_COMBINATIONS_1D, WINNING_COMBINATIONS_2D } from "../constants/index.js";
import type { PlayerSymbol, MoveNode } from "../types/index.js";

/**
 * Check for a winner in a 1D board (Array of 9 strings)
 * Returns the symbol ('X' or 'O') or null if no winner
 */
export function checkWinner1D(board: PlayerSymbol[]): PlayerSymbol | null {
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
export function isDraw1D(board: PlayerSymbol[]): boolean {
  return board.every((cell) => cell !== "");
}

/**
 * Check if the 2D board is full (draw)
 */
export function isDraw2D(board: (string | null)[][]): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

/**
 * Validates if a move can be made at the given index
 */
export function isValidMove(board: PlayerSymbol[], index: number): boolean {
  return index >= 0 && index < 9 && board[index] === "";
}

/**
 * Evaluates the game state and returns the outcome
 * @returns object with isDraw and winnerSymbol
 */
export function evaluateGameState(board: PlayerSymbol[]): { isDraw: boolean; winnerSymbol: PlayerSymbol | null } {
  const winnerSymbol = checkWinner1D(board);
  if (winnerSymbol) {
    return { isDraw: false, winnerSymbol };
  }
  if (isDraw1D(board)) {
    return { isDraw: true, winnerSymbol: null };
  }
  return { isDraw: false, winnerSymbol: null };
}

/**
 * Calculates the next turn player index
 */
export function calculateNextTurn(currentTurn: number, playersCount: number): number {
  const count = playersCount > 0 ? playersCount : 2; // Fallback to 2 players
  return (currentTurn + 1) % count;
}

/**
 * Reconstructs a 1D board from move history
 */
export function reconstructBoard(history: MoveNode[]): PlayerSymbol[] {
  const board: PlayerSymbol[] = Array(9).fill("");
  history.forEach((move) => {
    board[move.index] = move.symbol;
  });
  return board;
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
