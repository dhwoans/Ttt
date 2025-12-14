import State from "./State.js";
import PlayingState from "./PlayingState.js";
import type Ttt from "../game/Ttt.js";
import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type Action from "../dtos/Action.dto.js";

class IdleState extends State {
  onEnter(game: Ttt) {
    game.status = "IDLE";
  }

  handleAction(game: Ttt, action: Action): SuccessResponse | FailureResponse {
    // Manager가 호출하는 시작 명령만 허용
    if (action.type === "MANAGER_START") {
      game.changeState(new PlayingState());
      return { success: true, message: "Transition to Playing" };
    }
    return { success: false, message: "게임 시작 명령만 유효합니다." };
  }
}
export default IdleState;
