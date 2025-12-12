import type UserInfo from "../dtos/user/User.dto.js";
import IdleState from "../gameState/IdleState.js";
import type PlayerInfo from "../dtos/game/player.dto.js";
import type State from "../gameState/State.js";
import Context from "./Context.js";
import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type Action from "../dtos/Action.js";
/**
 * @class Ttt
 * @description Tic-Tac-Toe 게임의 컨텍스트(Context) 클래스.
 * 게임의 모든 데이터(상태)를 보유하며, 모든 외부 요청을 현재 상태 객체(currentState)에 위임합니다.
 * 상태 패턴 FSM에서 Context 역할을 담당합니다.
 */
class Ttt {
  board: Array<string>;
  winner: number;
  status: string;
  currentTurn: number;
  currentState: State;

  constructor() {
    this.board = Array(9).fill("");
    this.winner = -1;
    this.status = "IDLE";
    this.currentTurn = 0;
    this.currentState = new IdleState();
    this.currentState.onEnter(this);
  }

  changeState(newState: State): void {
    console.log(
      `[FSM] Transition: ${this.currentState.constructor.name} -> ${newState.constructor.name}`
    );
    this.currentState = newState;
    newState.onEnter(this); // 새 상태의 진입 로직 실행
  }

  processAction(action: Action): object {
    // currentState에게 모든 로직 처리를 위임
    return this.currentState.handleAction(this, action);
  }

  getState(): {
    board: Array<string>;
    winner: number;
    status: string;
    currentTurn: number;
  } {
    return {
      board: this.board,
      winner: this.winner,
      status: this.status,
      currentTurn: this.currentTurn,
    };
  }
}

export default Ttt;
