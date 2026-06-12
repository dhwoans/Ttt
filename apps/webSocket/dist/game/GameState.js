import IdleState from "../gameState/IdleState.js";
/**
 * Tic-Tac-Toe game context class (FSM Context pattern)
 * Manages game state, board, and players. Delegates all state-specific logic to current state.
 */
class GameState {
    board; // 9-element array for 3x3 board
    winner; // -2: draw, -1: no winner, 0/1: player index
    status; // IDLE, PLAYING, GAME_OVER
    players; // [player1Id, player2Id]
    currentTurn; // Turn counter (even=player0, odd=player1)
    currentState;
    constructor() {
        this.board = Array(9).fill("");
        this.winner = -1;
        this.status = "IDLE";
        this.currentTurn = 0;
        this.players = [];
        this.currentState = new IdleState();
        this.currentState.onEnter(this);
    }
    /**
     * Add player ID to the game
     */
    setPlayersId(playerId) {
        this.players.push(playerId);
    }
    /**
     * Transition to new state and invoke its entry logic
     */
    changeState(newState) {
        console.log(`[FSM] Transition: ${this.currentState.constructor.name} -> ${newState.constructor.name}`);
        this.currentState = newState;
        newState.onEnter(this);
    }
    /**
     * Delegate action processing to current state
     */
    processAction(action) {
        return this.currentState.handleAction(this, action);
    }
    /**
     * Get current game state snapshot
     */
    getState() {
        return {
            board: this.board,
            winner: this.winner,
            status: this.status,
            players: this.players,
            currentTurn: this.currentTurn,
        };
    }
}
export default GameState;
//# sourceMappingURL=GameState.js.map