import type State from "../gameState/State.js";
import type Action from "../dtos/Action.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
/**
 * @class Ttt
 * @description Tic-Tac-Toe 게임의 컨텍스트(Context) 클래스.
 * 게임의 모든 데이터(상태)를 보유하며, 모든 외부 요청을 현재 상태 객체(currentState)에 위임합니다.
 * 상태 패턴 FSM에서 Context 역할을 담당합니다.
 */
declare class Ttt {
    board: Array<string>;
    winner: number;
    status: string;
    players: Array<number>;
    currentTurn: number;
    currentState: State;
    constructor();
    setPlayersId(playerId: number): void;
    changeState(newState: State): void;
    processAction(action: Action): SuccessResponse | FailureResponse;
    getState(): {
        board: Array<string>;
        winner: number;
        status: string;
        players: Array<number>;
        currentTurn: number;
    };
}
export default Ttt;
//# sourceMappingURL=Ttt.d.ts.map