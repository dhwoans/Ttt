import SocketErrorResponder from "../routes/socketio/SocketErrorResponder.js";
import GameEventPublisher from "../routes/socketio/GameEventPublisher.js";
/**
 * 게임 진행 흐름(READY, MOVE, 상태 전이)을 오케스트레이션하는 서비스.
 *
 * 도메인 처리 결과를 받아 적절한 송신 이벤트를 발행하며,
 * Socket 핸들러가 비즈니스 규칙을 직접 가지지 않도록 분리한다.
 */
class GameFlowService {
    roomService;
    errors;
    publisher;
    readyTimeoutMs = 20000;
    readyTimeouts = new Map();
    readyTimeoutExpiresAt = new Map();
    turnTimeoutMs = 10000;
    turnTimeouts = new Map();
    turnTimeoutExpiresAt = new Map();
    turnTimeoutTokens = new Map();
    constructor(roomService, errors, publisher) {
        this.roomService = roomService;
        this.errors = errors;
        this.publisher = publisher;
    }
    onRoomStateChanged(roomId) {
        const roomResult = this.roomService.getRoomData(roomId);
        if (!roomResult.success || !roomResult.message) {
            this.clearReadyTimeout(roomId, "ROOM_UNAVAILABLE");
            this.clearTurnTimeout(roomId);
            return;
        }
        const players = roomResult.message.getAllPlayersData();
        const roomIsFull = roomResult.message.isFull();
        const allReady = players.length > 0 && players.every((player) => player.isReady);
        if (!roomIsFull) {
            this.clearReadyTimeout(roomId, "ROOM_NOT_FULL");
            this.clearTurnTimeout(roomId);
            return;
        }
        if (allReady) {
            this.clearReadyTimeout(roomId, "ALL_READY");
            return;
        }
        this.startReadyTimeout(roomId);
    }
    syncReadyTimeoutForSocket(socket, roomId) {
        const expiresAt = this.readyTimeoutExpiresAt.get(roomId);
        if (!expiresAt) {
            return;
        }
        const remainingMs = Math.max(0, expiresAt - Date.now());
        this.publisher.emitReadyTimeoutStartedToSocket(socket, roomId, remainingMs);
    }
    /**
     * READY 변경 처리:
     * - 플레이어 ready 상태 반영
     * - 전원 ready + 정원 충족 시 게임 시작
     * - 게임 시작 후 ready 초기화 및 PLAYING 전송
     */
    handleReady(socket, data) {
        const roomId = socket.data.roomId;
        const userId = socket.data.userId;
        const nickname = socket.data.nickname;
        const avatar = socket.data.avatar;
        if (!roomId || !userId || !nickname) {
            this.errors.emit(socket, "Not in a room");
            return;
        }
        const isReady = data?.isReady ?? true;
        const readyResult = this.roomService.readyPlayer(roomId, userId, isReady);
        if (!readyResult.success) {
            this.errors.emit(socket, "Failed to update ready status");
            return;
        }
        this.publisher.emitPlayerReady(roomId, {
            userId,
            nickname,
            ...(avatar ? { avatar } : {}),
            isReady,
        });
        const roomResult = this.roomService.getRoomData(roomId);
        if (!roomResult.success || !roomResult.message) {
            return;
        }
        const players = roomResult.message.getAllPlayersData();
        const allReady = players.length > 0 && players.every((player) => player.isReady);
        const roomIsFull = roomResult.message.isFull();
        if (!roomIsFull || !allReady) {
            this.onRoomStateChanged(roomId);
            return;
        }
        this.clearReadyTimeout(roomId, "ALL_READY");
        const startGameResult = this.roomService.gameStart(roomId);
        if (!startGameResult.success) {
            this.publisher.emitRoomError(roomId, "Failed to start game");
            return;
        }
        for (const player of players) {
            const resetReadyResult = this.roomService.readyPlayer(roomId, player.userId, false);
            if (!resetReadyResult.success) {
                continue;
            }
            this.publisher.emitPlayerReady(roomId, {
                userId: player.userId,
                nickname: player.nickname,
                ...(player.avatar ? { avatar: player.avatar } : {}),
                isReady: false,
            });
        }
        const gameStateResult = this.roomService.getGameState(roomId);
        if (!gameStateResult.success || !gameStateResult.message) {
            this.publisher.emitRoomError(roomId, "Failed to get game state");
            return;
        }
        const state = gameStateResult.message.getState();
        this.publisher.emitPlaying(roomId, {
            status: state.status,
            currentTurnPlayerId: state.players[state.currentTurn],
            players: state.players,
        });
        this.startTurnTimeout(roomId);
    }
    /**
     * MOVE 처리:
     * - 입력 검증
     * - 액션 적용
     * - MOVE/NEXT_TURN/GAME_OVER 이벤트 전송
     */
    handleMove(socket, data) {
        const roomId = socket.data.roomId;
        const userId = socket.data.userId;
        const nickname = socket.data.nickname;
        if (!roomId || !userId || !nickname) {
            this.errors.emit(socket, "Not in a room");
            return;
        }
        if (typeof data?.move !== "number" || data.move < 0 || data.move > 8) {
            this.errors.emit(socket, "Invalid move: must be 0-8");
            return;
        }
        const move = data.move;
        const action = {
            type: "MOVE",
            move,
            nickname,
        };
        const moveResult = this.roomService.getGameState(roomId);
        if (!moveResult.success || !moveResult.message) {
            this.errors.emit(socket, "Game not found");
            return;
        }
        const game = moveResult.message;
        const stateBeforeMove = game.getState();
        if (stateBeforeMove.status !== "PLAYING") {
            this.errors.emit(socket, "Game is not in PLAYING state");
            return;
        }
        const currentTurnPlayerId = stateBeforeMove.players[stateBeforeMove.currentTurn % stateBeforeMove.players.length];
        if (currentTurnPlayerId !== userId) {
            this.errors.emit(socket, "Not your turn");
            return;
        }
        this.clearTurnTimeout(roomId);
        const actionResult = game.processAction(action);
        if (!actionResult.success) {
            this.errors.emit(socket, actionResult.message);
            return;
        }
        const state = game.getState();
        this.publisher.emitMoveMade(roomId, {
            userId,
            move,
            isAuto: false,
        });
        if (state.status === "GAME_OVER") {
            this.clearTurnTimeout(roomId);
            let winnerUserId = null;
            let result = "draw";
            if (state.winner >= 0 && state.winner < state.players.length) {
                winnerUserId = state.players[state.winner] || null;
                result = "win";
            }
            this.publisher.emitGameOver(roomId, {
                result,
                winner: winnerUserId,
                winnerIndex: state.winner,
                board: state.board,
            });
            return;
        }
        const nextPlayerId = state.players[state.currentTurn % state.players.length];
        this.publisher.emitNextTurn(roomId, {
            currentTurn: state.currentTurn,
            nextPlayerId,
        });
        this.startTurnTimeout(roomId);
    }
    startTurnTimeout(roomId) {
        const gameStateResult = this.roomService.getGameState(roomId);
        if (!gameStateResult.success || !gameStateResult.message) {
            this.clearTurnTimeout(roomId);
            return;
        }
        const state = gameStateResult.message.getState();
        if (state.status !== "PLAYING" || state.players.length === 0) {
            this.clearTurnTimeout(roomId);
            return;
        }
        const currentTurnPlayerId = state.players[state.currentTurn % state.players.length];
        const existing = this.turnTimeouts.get(roomId);
        if (existing) {
            clearTimeout(existing);
            this.turnTimeouts.delete(roomId);
            this.turnTimeoutExpiresAt.delete(roomId);
        }
        const token = (this.turnTimeoutTokens.get(roomId) ?? 0) + 1;
        this.turnTimeoutTokens.set(roomId, token);
        const expiresAt = Date.now() + this.turnTimeoutMs;
        const timeout = setTimeout(() => {
            void this.handleTurnTimeout(roomId, token);
        }, this.turnTimeoutMs);
        this.turnTimeouts.set(roomId, timeout);
        this.turnTimeoutExpiresAt.set(roomId, expiresAt);
        this.publisher.emitTurnTimeoutStarted(roomId, {
            timeoutMs: this.turnTimeoutMs,
            currentTurnPlayerId,
        });
    }
    clearTurnTimeout(roomId) {
        const timeout = this.turnTimeouts.get(roomId);
        if (timeout) {
            clearTimeout(timeout);
        }
        this.turnTimeouts.delete(roomId);
        this.turnTimeoutExpiresAt.delete(roomId);
        this.turnTimeoutTokens.delete(roomId);
    }
    async handleTurnTimeout(roomId, token) {
        const currentToken = this.turnTimeoutTokens.get(roomId);
        if (currentToken !== token) {
            return;
        }
        this.turnTimeouts.delete(roomId);
        this.turnTimeoutExpiresAt.delete(roomId);
        const moveResult = this.roomService.getGameState(roomId);
        if (!moveResult.success || !moveResult.message) {
            this.clearTurnTimeout(roomId);
            return;
        }
        const game = moveResult.message;
        const state = game.getState();
        if (state.status !== "PLAYING" || state.players.length === 0) {
            this.clearTurnTimeout(roomId);
            return;
        }
        const currentPlayerId = state.players[state.currentTurn % state.players.length];
        const availableMoves = state.board
            .map((cell, index) => ({ cell, index }))
            .filter(({ cell }) => cell === "")
            .map(({ index }) => index);
        if (availableMoves.length === 0) {
            this.clearTurnTimeout(roomId);
            return;
        }
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        const roomResult = this.roomService.getRoomData(roomId);
        const nickname = roomResult.success && roomResult.message
            ? (roomResult.message
                .getAllPlayersData()
                .find((player) => player.userId === currentPlayerId)?.nickname ??
                "system")
            : "system";
        const actionResult = game.processAction({
            type: "MOVE",
            move: randomMove,
            nickname,
        });
        if (!actionResult.success) {
            this.startTurnTimeout(roomId);
            return;
        }
        const updatedState = game.getState();
        this.publisher.emitMoveMade(roomId, {
            userId: currentPlayerId,
            move: randomMove,
            isAuto: true,
        });
        if (updatedState.status === "GAME_OVER") {
            let winnerUserId = null;
            let result = "draw";
            if (updatedState.winner >= 0 &&
                updatedState.winner < updatedState.players.length) {
                winnerUserId = updatedState.players[updatedState.winner] || null;
                result = "win";
            }
            this.publisher.emitGameOver(roomId, {
                result,
                winner: winnerUserId,
                winnerIndex: updatedState.winner,
                board: updatedState.board,
            });
            this.clearTurnTimeout(roomId);
            return;
        }
        const nextPlayerId = updatedState.players[updatedState.currentTurn % updatedState.players.length];
        this.publisher.emitNextTurn(roomId, {
            currentTurn: updatedState.currentTurn,
            nextPlayerId,
        });
        this.startTurnTimeout(roomId);
    }
    startReadyTimeout(roomId) {
        if (this.readyTimeouts.has(roomId)) {
            const expiresAt = this.readyTimeoutExpiresAt.get(roomId);
            const remainingMs = expiresAt ? Math.max(0, expiresAt - Date.now()) : 0;
            this.publisher.emitReadyTimeoutStarted(roomId, remainingMs);
            return;
        }
        const expiresAt = Date.now() + this.readyTimeoutMs;
        const timeout = setTimeout(() => {
            void this.handleReadyTimeout(roomId);
        }, this.readyTimeoutMs);
        this.readyTimeouts.set(roomId, timeout);
        this.readyTimeoutExpiresAt.set(roomId, expiresAt);
        this.publisher.emitReadyTimeoutStarted(roomId, this.readyTimeoutMs);
    }
    clearReadyTimeout(roomId, reason) {
        const timeout = this.readyTimeouts.get(roomId);
        if (!timeout) {
            return;
        }
        clearTimeout(timeout);
        this.readyTimeouts.delete(roomId);
        this.readyTimeoutExpiresAt.delete(roomId);
        this.publisher.emitReadyTimeoutCanceled(roomId, reason);
    }
    async handleReadyTimeout(roomId) {
        this.readyTimeouts.delete(roomId);
        this.readyTimeoutExpiresAt.delete(roomId);
        const roomResult = this.roomService.getRoomData(roomId);
        if (!roomResult.success || !roomResult.message) {
            return;
        }
        if (!roomResult.message.isFull()) {
            return;
        }
        const players = roomResult.message.getAllPlayersData();
        const unreadyPlayers = players.filter((player) => !player.isReady);
        if (unreadyPlayers.length === 0) {
            return;
        }
        for (const player of unreadyPlayers) {
            const removeResult = this.roomService.removePlayer(roomId, player.userId);
            if (!removeResult.success) {
                continue;
            }
            await this.publisher.evictPlayerFromRoom(roomId, player.userId, "Ready timeout");
        }
        const updatedRoomResult = this.roomService.getRoomData(roomId);
        if (!updatedRoomResult.success || !updatedRoomResult.message) {
            return;
        }
        const remainingPlayers = updatedRoomResult.message.getAllPlayersData();
        for (const player of remainingPlayers) {
            if (!player.isReady) {
                continue;
            }
            const resetResult = this.roomService.readyPlayer(roomId, player.userId, false);
            if (!resetResult.success) {
                continue;
            }
            this.publisher.emitPlayerReady(roomId, {
                userId: player.userId,
                nickname: player.nickname,
                ...(player.avatar ? { avatar: player.avatar } : {}),
                isReady: false,
            });
        }
        this.publisher.emitReadyTimeoutExpired(roomId, "system", "Ready timeout: unready player removed");
    }
}
export default GameFlowService;
//# sourceMappingURL=GameFlowService.js.map