// GameOverState.js
import State from "./State.js";
import IdleState from "./IdleState.js";

class GameOverState extends State {
  onEnter(game) {
    game.status = "GAME_OVER";
  }

  handleAction(game, action) {
    // 클라이언트가 보내는 RESET 액션만 허용
    if (action.type === "RESET") {
      //GameOverState -> IdleState
      game.board = Array(9).fill("");
      game.winner = null;
      game.currentTurn = null;
      game.players = [];
      game.changeState(new IdleState());
      return { success: true, message: "게임 초기화 완료." };
    }
    return { success: false, message: "게임 리셋 중 에러발생" };
  }
}
export default GameOverState;
