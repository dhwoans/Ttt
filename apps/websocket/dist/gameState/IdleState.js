// IdleState.ts - Tic-Tac-Toe idle/waiting state
import State from "./State.js";
import PlayingState from "./PlayingState.js";
/**
 * Represents the IDLE state in the game FSM.
 * Game is waiting for players to be ready. Only accepts MANAGER_START action.
 */
class IdleState extends State {
    onEnter(game) {
        game.status = "IDLE";
    }
    handleAction(game, action) {
        // Only manager can initiate game start from idle state
        if (action.type === "MANAGER_START") {
            game.changeState(new PlayingState());
            return { success: true, message: "Transition to Playing" };
        }
        return {
            success: false,
            message: "Only game start action is allowed in IDLE state",
        };
    }
}
export default IdleState;
//# sourceMappingURL=IdleState.js.map