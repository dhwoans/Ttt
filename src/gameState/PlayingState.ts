// PlayingState.js
import State from "./State.js";
import Ttt from "../game/Ttt.js";
import GameOverState from "./GameOverState.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type Action from "../dtos/Action.dto.js";

class PlayingState extends State {
  onEnter(game: Ttt) {
    // 상태 진입 시 초기 설정: 컨텍스트 데이터 업데이트
    game.status = "PLAYING";
    // 선턴 지정 (FSM에 의해 턴이 확정됨)
    game.currentTurn = 0;
    console.log(`[FSM] Game started. Turn: ${game.currentTurn}`);
  }

  handleAction(game: Ttt, action: Action): SuccessResponse | FailureResponse {
    const index = action.move;
    // 위치 검증
    if (game.board[index] !== "") {
      return { success: false, message: "이미 착수된 위치" };
    }

    //데이터 업데이트
    const symbol = game.currentTurn % 2 == 0 ? "X" : "O";
    game.board[index] = symbol;

    // 승리/무승부 판별 (전이 조건 체크)
    const winner = this.#checkWinner(game.board);
    if (winner !== -1 || game.currentTurn === 8) {
      if (winner === -1) {
        game.winner = -2;
      } else {
        game.winner = winner;
      }
      // PlayingState -> GameOverState
      game.changeState(new GameOverState());
      return { success: true, message: "Game_Over" };
    }

    //턴 전환
    game.currentTurn += 1;
    return { success: true };
  }

  #checkWinner(board: Array<string>): number {
    const lines: Array<[number, number, number]> = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === "X" ? 0 : 1;
      }
    }
    return -1;
  }
}

export default PlayingState;
