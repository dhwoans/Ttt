import State from "./State.js";
import IdleState from "./IdleState.js";
import type Context from "../game/Context.js";
import type { Action, Response } from "../types/index.js";

/**
 * Represents the GAME_OVER state in the game FSM.
 * Only accepts RESET action to transition back to IDLE state.
 */
export default class GameOverState extends State {
  onEnter(game: Context): void {
    game.tree.game.status = "GAME_OVER";
  }

  handleAction(
    game: Context,
    action: Action,
  ): Response<string> {
    // Only RESET action is valid in game over state
    if (action.type === "RESET") {
      // Reset game board and transition to IDLE state
      game.tree.game.board = Array(9).fill("");
      game.tree.game.winner = -1;
      game.tree.game.currentTurn = 0;
      game.tree.game.history = [];
      game.changeState(new IdleState());
      return { success: true, message: "Game reset complete" };
    }
    return { success: false, message: "Invalid action in GAME_OVER state" };
  }
}
