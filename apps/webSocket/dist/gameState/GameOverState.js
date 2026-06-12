// GameOverState.ts - Tic-Tac-Toe game over state
import State from "./State.js";
import IdleState from "./IdleState.js";
/**
 * Represents the GAME_OVER state in the game FSM.
 * Only accepts RESET action to transition back to IDLE state.
 */
class GameOverState extends State {
    onEnter(game) {
        game.status = "GAME_OVER";
    }
    handleAction(game, action) {
        // Only RESET action is valid in game over state
        if (action.type === "RESET") {
            // Reset game board and transition to IDLE state
            game.board = Array(9).fill("");
            game.winner = -1;
            game.currentTurn = 0;
            game.changeState(new IdleState());
            return { success: true, message: "Game reset complete" };
        }
        return { success: false, message: "Invalid action in GAME_OVER state" };
    }
}
export default GameOverState;
//# sourceMappingURL=GameOverState.js.map