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
      // ⭐ 상태 전이: GameOverState -> IdleState
      game.board = Array(9).fill(null);
      game.winner = null;
      game.currentTurn = null;
      game.changeState(new IdleState());
      return { success: true, message: "Game has been reset." };
    }
    return { success: false, message: "게임 종료 후에는 리셋만 가능합니다." };
  }
}
export default GameOverState;
