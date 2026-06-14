import State from "./State.js";
import GameOverState from "./GameOverState.js";
import type Context from "../game/Context.js";
import type { Action, Response } from "../types/index.js";
import { checkWinner1D } from "../utils/tttUtils.js";

/**
 * Represents the PLAYING state in the game FSM.
 * Handles move validation, board updates, and win/draw detection.
 */
export default class PlayingState extends State {
  onEnter(game: Context): void {
    game.status = "PLAYING";
    game.currentTurn = Math.floor(Math.random() * game.players.length);
    console.log(`[FSM] Game started. Initial turn: ${game.currentTurn}`);
  }

  handleAction(
    game: Context,
    action: Action,
  ): Response<string> {
    const index = action.move;
    
    // Validate position hasn't been taken
    if (game.board[index] !== "") {
      return { success: false, message: "Position already occupied" };
    }

    // Update board with current player's symbol
    const symbol = game.currentTurn % 2 == 0 ? "X" : "O";
    game.board[index] = symbol;

    // Check for win or draw
    const winnerSymbol = checkWinner1D(game.board);
    const isFull = game.board.every(cell => cell !== "");

    if (winnerSymbol || isFull) {
      if (!winnerSymbol) {
        game.winner = -2; // Draw condition
      } else {
        game.winner = winnerSymbol === "X" ? 0 : 1;
      }
      game.changeState(new GameOverState());
      return { success: true, message: "Game_Over" };
    }

    // Advance turn
    game.currentTurn += 1;
    return { success: true };
  }
}
