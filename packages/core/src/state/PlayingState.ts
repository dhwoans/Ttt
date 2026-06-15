import State from "./State.js";
import GameOverState from "./GameOverState.js";
import type Context from "../game/Context.js";
import type { Action, Response } from "../types/index.js";
import { isValidMove, evaluateGameState, calculateNextTurn, reconstructBoard } from "../utils/tttUtils.js";

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
    const currentBoard = reconstructBoard(game.tree.game.history);

    if (action.type === "TIMEOUT") {
      // Find all empty positions
      const availableMoves = currentBoard
        .map((cell, i) => (cell === "" ? i : -1))
        .filter((i) => i !== -1);

      if (availableMoves.length === 0) {
        return { success: false, message: "No available moves" };
      }

      index = availableMoves[Math.floor(Math.random() * availableMoves.length)]!;
      console.log(`[FSM] Timeout handled for ${action.nickname}. Random move: ${index}`);
    } else {
      if (action.move === undefined) {
        return { success: false, message: "Move index is required" };
      }
      index = action.move;
    }
    
    // Validate move using utility
    if (!isValidMove(currentBoard, index)) {
      return { success: false, message: "Invalid or occupied position" };
    }

    // Determine current player's symbol
    const symbol = action.symbol ?? (game.tree.game.currentTurn % 2 == 0 ? "X" : "O");

    // Record history
    game.tree.game.history.push({
      index,
      symbol,
      nickname: action.nickname,
    });

    // Evaluate game state using utility and the reconstructed board with the new move
    const nextBoard = reconstructBoard(game.tree.game.history);
    const outcome = evaluateGameState(nextBoard);

    if (outcome !== -1) {
      game.tree.game.winner = outcome;
      game.changeState(new GameOverState());
      return { success: true, message: "Game_Over" };
    }

    // Advance turn using utility
    game.tree.game.currentTurn = calculateNextTurn(
      game.tree.game.currentTurn,
      game.tree.players.length
    );
    
    return { success: true };
  }
}
