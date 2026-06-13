import Ttt from "../game/GameState.js";
import PlayingState from "../gameState/PlayingState.js";
class GameSessionManager {
    games = new Map();
    getGameState(roomId) {
        const game = this.games.get(roomId);
        if (!game) {
            return {
                success: false,
                message: `Game state not found: roomId=${roomId}`,
            };
        }
        return { success: true, message: game };
    }
    startGame(roomId, playerIds) {
        this.games.set(roomId, new Ttt());
        const game = this.games.get(roomId);
        if (!game) {
            return {
                success: false,
                message: "Failed to create game session",
            };
        }
        for (const playerId of playerIds) {
            game.setPlayersId(playerId);
        }
        game.changeState(new PlayingState());
        const state = game.getState();
        if (state.status !== "PLAYING") {
            return {
                success: false,
                message: `Failed to start game: invalid state ${state.status}`,
            };
        }
        if (state.players.length !== 2) {
            return {
                success: false,
                message: `Failed to start game: insufficient players (${state.players.length}/2)`,
            };
        }
        return { success: true };
    }
    deleteGame(roomId) {
        this.games.delete(roomId);
        if (this.games.get(roomId)) {
            return { success: false, message: "게임 삭제 실패" };
        }
        return { success: true };
    }
    applyMove(roomId, action) {
        const game = this.games.get(roomId);
        if (!game) {
            return {
                success: false,
                message: `Game instance not found: roomId=${roomId}`,
            };
        }
        const state = game.getState();
        if (state.status !== "PLAYING") {
            return {
                success: false,
                message: "Game is not in PLAYING state",
            };
        }
        return game.processAction(action);
    }
}
export default GameSessionManager;
//# sourceMappingURL=GameSessionManager.js.map