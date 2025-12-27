import type State from "../gameState/State.js";
export default abstract class Context {
    winner: string;
    status: string;
    currentTurn: number;
    players: Array<object>;
    currentState: State;
    constructor();
    /**
     * @method getState
     * @description 현재 게임의 모든 상태 데이터 반환
     * @returns {object}
     */
    abstract getState(): object;
    /**
     * @method changeState
     * @description FSM의 상태를 새로운 상태로 전이(Transition)시키는 메서드입니다.
     * 이 메서드는 현재 상태 클래스(예: PlayingState) 내부에서 호출됩니다.
     * @param {GameState} newState - 새로 전환될 상태 클래스의 인스턴스 (예: new PlayingState())
     */
    abstract changeState(): void;
    /**
     * @method processAction
     * @description Manager에서 들어오는 모든 액션을 처리
     * 실제 처리 로직은 현재 상태 객체(currentState)에게 위임
     * @param {object} action - 클라이언트가 보낸 액션 정보 (type, payload 포함)
     * @returns {object} - 액션 처리 결과 ({ success: boolean, message?: string })
     */
    abstract processAction(action: object): object;
}
//# sourceMappingURL=Context.d.ts.map