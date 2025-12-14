import State from "./State.js";
import IdleState from "./IdleState.js";
import type Ttt from "../game/Ttt.js";
import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type Action from "../dtos/Action.dto.js";

class GameOverState extends State {
  onEnter(game: Ttt) {
    game.status = "GAME_OVER";
  }

  handleAction(game: Ttt, action: Action) {
    // 클라이언트가 보내는 RESET 액션만 허용
    if (action.type === "RESET") {
      //GameOverState -> IdleState
      game.board = Array(9).fill("");
      game.winner = -1;
      game.currentTurn = 0;
      game.changeState(new IdleState());
      return { success: true, message: "게임 초기화 완료." };
    }
    return { success: false, message: "게임 리셋 중 에러발생" };
  }
}
export default GameOverState;
