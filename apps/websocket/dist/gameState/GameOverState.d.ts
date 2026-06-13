import State from "./State.js";
import type Ttt from "../game/GameState.js";
import type Action from "../dtos/Action.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
/**
 * Represents the GAME_OVER state in the game FSM.
 * Only accepts RESET action to transition back to IDLE state.
 */
declare class GameOverState extends State {
    onEnter(game: Ttt): void;
    handleAction(game: Ttt, action: Action): SuccessResponse<string> | FailureResponse;
}
export default GameOverState;
//# sourceMappingURL=GameOverState.d.ts.map