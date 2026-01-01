// IdleState.ts - Tic-Tac-Toe idle/waiting state
import State from "./State.js";
import PlayingState from "./PlayingState.js";
import type Ttt from "../game/Ttt.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type Action from "../dtos/Action.dto.js";

/**
 * Represents the IDLE state in the game FSM.
 * Game is waiting for players to be ready. Only accepts MANAGER_START action.
 */
class IdleState extends State {
  onEnter(game: Ttt): void {
    game.status = "IDLE";
  }

  handleAction(
    game: Ttt,
    action: Action
  ): SuccessResponse<string> | FailureResponse {
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
export default IdleState;
