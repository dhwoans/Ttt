import State from "./State.js";
import Ttt from "../game/Ttt.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type Action from "../dtos/Action.dto.js";
/**
 * Represents the PLAYING state in the game FSM.
 * Handles move validation, board updates, and win/draw detection.
 */
declare class PlayingState extends State {
    #private;
    onEnter(game: Ttt): void;
    handleAction(game: Ttt, action: Action): SuccessResponse<string> | FailureResponse;
}
export default PlayingState;
//# sourceMappingURL=PlayingState.d.ts.map