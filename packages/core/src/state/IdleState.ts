import State from "./State.js";
import PlayingState from "./PlayingState.js";
import type Context from "../game/Context.js";
import type { Action, Response } from "../types/index.js";

/**
 * Represents the IDLE state in the game FSM.
 * Game is waiting for players to be ready. Only accepts MANAGER_START action.
 */
export default class IdleState extends State {
  onEnter(game: Context): void {
    game.tree.game.status = "IDLE";
  }

  handleAction(game: Context, action: Action): Response<string> {
    if (action.type === "READY") {
      const player = game.tree.players.find((p) => p.id === action.userId);
      if (!player) {
        return { success: false, message: "Player not found in room" };
      }

      player.isReady = action.isReady ?? true;

      // Check if all players are ready and there are 2 players
      const allReady =
        game.tree.players.length === 2 &&
        game.tree.players.every((p) => p.isReady);

      if (allReady) {
        game.changeState(new PlayingState());
        return { success: true, message: "Transition to Playing" };
      }

      return { success: true, message: "Ready status updated" };
    }

    // Both user start and system start are handled by "START" action
    if (action.type === "START") {
      if (game.tree.players.length < 2) {
        return { success: false, message: "Need 2 players to start" };
      }
      game.changeState(new PlayingState());
      return { success: true, message: "Transition to Playing" };
    }
    return {
      success: false,
      message: "Only READY or START action is allowed in IDLE state",
    };
  }
}
