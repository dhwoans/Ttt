import State from "./State.js";
import type Ttt from "../game/Ttt.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type Action from "../dtos/Action.dto.js";
/**
 * Represents the IDLE state in the game FSM.
 * Game is waiting for players to be ready. Only accepts MANAGER_START action.
 */
declare class IdleState extends State {
    onEnter(game: Ttt): void;
    handleAction(game: Ttt, action: Action): SuccessResponse<string> | FailureResponse;
}
export default IdleState;
//# sourceMappingURL=IdleState.d.ts.map