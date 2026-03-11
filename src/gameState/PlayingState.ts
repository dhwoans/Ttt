// PlayingState.ts - Tic-Tac-Toe game playing state
import State from "./State.js";
import Ttt from "../game/Ttt.js";
import GameOverState from "./GameOverState.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type Action from "../dtos/Action.dto.js";

/**
 * Represents the PLAYING state in the game FSM.
 * Handles move validation, board updates, and win/draw detection.
 */
class PlayingState extends State {
  onEnter(game: Ttt): void {
    game.status = "PLAYING";
    game.currentTurn = Math.floor(Math.random() * game.players.length);
    console.log(`[FSM] Game started. Initial turn: ${game.currentTurn}`);
  }

  handleAction(
    game: Ttt,
    action: Action,
  ): SuccessResponse<string> | FailureResponse {
    const index = action.move;
    // Validate position hasn't been taken
    if (game.board[index] !== "") {
      return { success: false, message: "Position already occupied" };
    }

    // Update board with current player's symbol
    const symbol = game.currentTurn % 2 == 0 ? "X" : "O";
    game.board[index] = symbol;

    // Check for win or draw
    const winner = this.#checkWinner(game.board);
    if (winner !== -1 || game.currentTurn === 8) {
      if (winner === -1) {
        game.winner = -2; // Draw condition
      } else {
        game.winner = winner;
      }
      game.changeState(new GameOverState());
      return { success: true, message: "Game_Over" };
    }

    // Advance turn
    game.currentTurn += 1;
    return { success: true };
  }

  /**
   * Check for winning combinations on the board
   * Returns 0 for X win, 1 for O win, -1 for no winner
   */
  #checkWinner(board: Array<string>): number {
    const lines: Array<[number, number, number]> = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === "X" ? 0 : 1;
      }
    }
    return -1;
  }
}

export default PlayingState;
