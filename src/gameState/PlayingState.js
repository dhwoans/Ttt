// PlayingState.js
import State from "./State.js";
import GameOverState from "./GameOverState.js"; // 전이 대상 클래스

class PlayingState extends State {
  onEnter(game) {
    // 상태 진입 시 초기 설정: 컨텍스트 데이터 업데이트
    game.status = "PLAYING";
    // 선턴 지정 (FSM에 의해 턴이 확정됨)
    game.currentTurn = 0;
    console.log(`[FSM] Game started. Turn: ${game.currentTurn}`);
  }

  handleAction(game, action) {
    const [_, index] = action.message;
    // 턴 검증
    if (game.players[game.currentTurn % 2].nickname !== action.sender) {
      return { success: false, message: "현재 턴 아님" };
    }
    // 위치 검증
    if (game.board[index] !== "") {
      return { success: false, message: "이미 착수된 위치" };
    }

    //데이터 업데이트
    const symbol = game.currentTurn % 2 == 0 ? "X" : "O";
    game.board[index] = symbol;

    // 승리/무승부 판별 (전이 조건 체크)
    const winner = this.#checkWinner(game.board);
    if (winner || this.#isBoardFull(game.board)) {
      if (!winner) {
        game.winner = "DRAW";
      } else {
        game.winner =
          game.winner === "X"
            ? game.players[0].nickname
            : game.players[1].nickname;
      }
      // PlayingState -> GameOverState
      game.changeState(new GameOverState());
      return { success: true, message: "Game Over" };
    }

    //턴 전환
    game.currentTurn += 1;
    return { success: true };
  }

  // --- 틱택토 룰은 상태 클래스 내부의 private 메서드로 캡슐화 ---
  #checkWinner(board) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }
  #isBoardFull(board) {
    return board.every((cell) => cell !== "");
  }
}

export default PlayingState;
