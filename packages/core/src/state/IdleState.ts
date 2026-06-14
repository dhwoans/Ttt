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
    game.status = "IDLE";
  }

  handleAction(
    game: Context,
    action: Action,
  ): Response<string> {
    // Only manager can initiate game start from idle state
    if (action.type === "MANAGER_START") {
      game.changeState(new PlayingState());
      return { success: true, message: "Transition to Playing" };
    }
    return {
      success: false,
      message: "Only game start action is allowed in IDLE state",
    };
  }
}
