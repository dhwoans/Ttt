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
    game.tree.game.status = "PLAYING";
    game.tree.game.currentTurn = Math.floor(Math.random() * game.tree.players.length);
    console.log(`[FSM] Game started. Initial turn: ${game.tree.game.currentTurn}`);
  }

  handleAction(
    game: Context,
    action: Action,
  ): Response<string> {
    let index: number;

    if (action.type === "TIMEOUT") {
      // Find all empty positions
      const availableMoves = game.tree.game.board
        .map((cell, i) => (cell === "" ? i : -1))
        .filter((i) => i !== -1);

      if (availableMoves.length === 0) {
        return { success: false, message: "No available moves" };
      }

      // Select a random move
      index = availableMoves[Math.floor(Math.random() * availableMoves.length)]!;
      console.log(`[FSM] Timeout handled for ${action.nickname}. Random move: ${index}`);
    } else {
      if (action.move === undefined) {
        return { success: false, message: "Move index is required" };
      }
      index = action.move;
    }
    
    // Validate position hasn't been taken
    if (game.tree.game.board[index] !== "") {
      return { success: false, message: "Position already occupied" };
    }

    // Update board with current player's symbol
    const symbol = game.tree.game.currentTurn % 2 == 0 ? "X" : "O";
    game.tree.game.board[index] = symbol;

    // Record history
    game.tree.game.history.push({
      index,
      symbol,
      nickname: action.nickname,
    });

    // Check for win or draw
    const winnerSymbol = checkWinner1D(game.tree.game.board);
    const isFull = game.tree.game.board.every(cell => cell !== "");

    if (winnerSymbol || isFull) {
      if (!winnerSymbol) {
        game.tree.game.winner = -2; // Draw condition
      } else {
        game.tree.game.winner = winnerSymbol === "X" ? 0 : 1;
      }
      game.changeState(new GameOverState());
      return { success: true, message: "Game_Over" };
    }

    // Advance turn
    game.tree.game.currentTurn += 1;
    return { success: true };
  }
}
