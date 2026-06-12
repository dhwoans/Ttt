import { eventshandler, EVENT_LIST, EMIT_MODES, } from "../../utils/eventhandler.js";
class LegacyWsGameService {
    gameSessionManager;
    roomService;
    constructor(gameSessionManager, roomService) {
        this.gameSessionManager = gameSessionManager;
        this.roomService = roomService;
    }
    processMove(rawMessage, userId) {
        const { type, message, sender } = rawMessage;
        const [roomId, index] = message;
        const action = { type, move: parseInt(index), nickname: sender };
        const applyResult = this.gameSessionManager.applyMove(roomId, action);
        if (!applyResult.success) {
            const errorPayload = {
                type: "ERROR",
                message: [applyResult.message],
                sender: "system",
            };
            eventshandler.emit(EVENT_LIST.ERROR, {
                mode: EMIT_MODES.UNICAST,
                targetId: userId,
                payload: errorPayload,
            });
            return applyResult;
        }
        const gameStateResult = this.roomService.getGameState(roomId);
        if (!gameStateResult.success || !gameStateResult.message) {
            return { success: false, message: "게임 상태 얻기 실패" };
        }
        const state = gameStateResult.message.getState();
        const roomResult = this.roomService.checkRoom(roomId);
        if (!roomResult.success) {
            return { success: false, message: roomResult.message };
        }
        this.broadcastMove(roomId, sender, index.toString());
        this.broadcastNextGameState(roomId, state);
        return { success: true };
    }
    broadcastMove(roomId, sender, index) {
        const moveMessage = {
            type: "MOVE",
            message: [sender, index],
            sender: "system",
        };
        eventshandler.emit(EVENT_LIST.MOVE, {
            mode: EMIT_MODES.BROADCAST,
            roomId,
            payload: moveMessage,
        });
    }
    broadcastNextGameState(roomId, state) {
        let nextMessage;
        if (state.status === "GAME_OVER") {
            const winner = state.winner === -2 ? "DRAW" : state.players[state.winner];
            nextMessage = { type: state.status, message: [winner], sender: "system" };
            this.gameSessionManager.deleteGame(roomId);
            this.resetReady(roomId);
        }
        else {
            nextMessage = {
                type: state.status,
                message: [state.players[state.currentTurn % 2].toString()],
                sender: "system",
            };
        }
        eventshandler.emit(state.status, {
            mode: EMIT_MODES.BROADCAST,
            roomId,
            payload: nextMessage,
        });
    }
    resetReady(roomId) {
        const roomResult = this.roomService.getRoomData(roomId);
        if (!roomResult.success || !roomResult.message) {
            return;
        }
        for (const player of roomResult.message.getAllPlayersData()) {
            this.roomService.readyPlayer(roomId, player.userId, false);
        }
    }
}
export default LegacyWsGameService;
//# sourceMappingURL=LegacyWsGameService.js.map