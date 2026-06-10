import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import Ttt from "../game/GameState.js";
import type Action from "../dtos/Action.dto.js";

export default abstract class State {
  abstract handleAction(
    game: Ttt,
    action: Action,
  ): SuccessResponse<string | void> | FailureResponse;
  abstract onEnter(game: Ttt): void;
}
