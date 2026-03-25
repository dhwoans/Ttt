import type State from "../gameState/State.js";
import type Action from "../dtos/Action.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { ConnId } from "../type/socket.js";
/**
 * Tic-Tac-Toe game context class (FSM Context pattern)
 * Manages game state, board, and players. Delegates all state-specific logic to current state.
 */
declare class Ttt {
    board: Array<string>;
    winner: number;
    status: string;
    players: Array<ConnId>;
    currentTurn: number;
    currentState: State;
    constructor();
    /**
     * Add player ID to the game
     */
    setPlayersId(playerId: string): void;
    /**
     * Transition to new state and invoke its entry logic
     */
    changeState(newState: State): void;
    /**
     * Delegate action processing to current state
     */
    processAction(action: Action): SuccessResponse<string | void> | FailureResponse;
    /**
     * Get current game state snapshot
     */
    getState(): {
        board: Array<string>;
        winner: number;
        status: string;
        players: Array<string>;
        currentTurn: number;
    };
}
export default Ttt;
//# sourceMappingURL=Ttt.d.ts.map