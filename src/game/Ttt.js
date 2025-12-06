import IdleState from "../gameState/IdleState.js";

/**
 * @class Ttt
 * @description Tic-Tac-Toe 게임의 컨텍스트(Context) 클래스.
 * 게임의 모든 데이터(상태)를 보유하며, 모든 외부 요청을 현재 상태 객체(currentState)에 위임합니다.
 * 상태 패턴 FSM에서 Context 역할을 담당합니다.
 */
class Ttt {
  constructor() {
    this.board = Array(9).fill("");
    this.winner = null;
    this.status = "IDLE";
    this.currentTurn = null;
    this.players = [];
    this.currentState = new IdleState();
    this.currentState.onEnter(this);
  }

  /**
   * @method setPlayers
   * @description 플레이어 ID Context에 저장
   * @param {object} playersMap
   */
  setPlayers(playersMap) {
    for (const [playerId, playerInfo] of playersMap) {
      this.players.push({ playerId, nickname: playerInfo.nickname });
    }
  }

  /**
   * @method changeState
   * @description FSM의 상태를 새로운 상태로 전이(Transition)시키는 메서드입니다.
   * 이 메서드는 현재 상태 클래스(예: PlayingState) 내부에서 호출됩니다.
   * @param {GameState} newState - 새로 전환될 상태 클래스의 인스턴스 (예: new PlayingState())
   */
  changeState(newState) {
    console.log(
      `[FSM] Transition: ${this.currentState.constructor.name} -> ${newState.constructor.name}`
    );
    this.currentState = newState; // 현재 상태를 새 상태 인스턴스로 교체
    newState.onEnter(this); // 새 상태의 진입 로직 실행
  }

  /**
   * @method processAction
   * @description Manager에서 들어오는 모든 액션을 처리
   * 실제 처리 로직은 현재 상태 객체(currentState)에게 위임
   * @param {object} action - 클라이언트가 보낸 액션 정보 (type, payload 포함)
   * @returns {object} - 액션 처리 결과 ({ success: boolean, message?: string })
   */
  processAction(action) {
    // currentState에게 모든 로직 처리를 위임
    return this.currentState.handleAction(this, action);
  }

  /**
   * @method getState
   * @description 현재 게임의 모든 상태 데이터 반환
   * @returns {object}
   */
  getState() {
    return {
      board: this.board,
      players: this.players,
      winner: this.winner,
      status: this.status,
      currentTurn: this.currentTurn,
    };
  }
}

export default Ttt;
