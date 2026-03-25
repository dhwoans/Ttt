import { randomUUID } from "node:crypto";
import { eventshandler, EVENT_LIST, EMIT_MODES, } from "../utils/eventhandler.js";
class Service {
    manager;
    constructor(manager) {
        this.manager = manager;
    }
    /**
     *
     * @param userId
     * @param nickname
     * @returns
     */
    createRoom(userId, nickname) {
        if (!userId || !nickname) {
            throw new Error(`${this.constructor.name} : 정보가 누락되었습니다.`);
        }
        const roomId = randomUUID();
        return this.manager.createRoom(roomId);
    }
    /**
     * @description 실제로 방이 있는지 확인
     * @param {string} roomId
     * @returns {Room}
     */
    checkRoom(roomId) {
        return this.manager.getRoomData(roomId);
    }
    /**
     * Get room data by roomId
     * @param {string} roomId
     * @returns {Room} Room instance
     */
    getRoomData(roomId) {
        return this.manager.getRoomData(roomId);
    }
    /**
     *
     * @param roomId
     * @param connId
     * @returns
     */
    removePlayer(roomId, connId) {
        return this.manager.removePlayer(roomId, connId);
    }
    /**
     * @description 모든 방의 roomId와 현재 플레이어 수를 반환
     * @returns {Array<object>} [{roomId: number, playerCount: number, isFull: boolean}]
     */
    getRoomList() {
        return this.manager.getRoomList();
    }
    /**
     * Find or create a room for matchmaking
     * @returns {RoomId} The assigned room ID
     */
    findOrCreateRoom() {
        return this.manager.findOrCreateRoom();
    }
    /**
     *
     * @param roomId
     * @param connId
     * @param nickname
     * @param avatar
     * @returns
     */
    joinPlayer(roomId, connId, nickname, avatar) {
        return this.manager.joinPlayer(roomId, connId, nickname, avatar);
    }
    /**
     * @description 플레이어 레디상태 처리
     * @param {number} roomId
     * @param {number} connId
     * @param {bool} status
     * @returns {object}
     */
    readyPlayer(roomId, connId, status) {
        return this.manager.readyPlayer(roomId, connId, status);
    }
    /**
     * @description 게임 시작 처리
     * @param {number} roomId
     * @returns {boolean}
     */
    gameStart(roomId) {
        // 레디 검증
        const result = this.checkRoom(roomId);
        if (result.success && result.message) {
            const room = result.message;
            if (room.isFull()) {
                for (const { connId, nickname, isReady } of room.getAllPlayersData()) {
                    if (!isReady) {
                        return { success: false, message: "레디 안함" };
                    }
                }
                //시작 처리
                this.manager.gameStart(roomId);
                return { success: true };
            }
            else {
                // 인원 부족
                return { success: false, message: "인원 부족" };
            }
        }
        else {
            return { success: true };
        }
    }
    /**
     * @description
     * @param message
     * @returns
     */
    setMove(rawMessage) {
        const { type, message, sender } = rawMessage;
        const [roomId, index] = rawMessage.message;
        //message -> action
        const action = {
            type,
            move: parseInt(index),
            nickname: sender,
        };
        return this.manager.setMove(roomId, action);
    }
    processMove(rawMessage, connId) {
        const { type, message, sender } = rawMessage;
        const [roomId, index] = message;
        const action = { type, move: parseInt(index), nickname: sender };
        const applyResult = this.manager.setMove(roomId, action);
        if (!applyResult.success) {
            // emit error to requesting client
            const errorPayload = {
                type: "ERROR",
                message: [applyResult.message],
                sender: "system",
            };
            eventshandler.emit(EVENT_LIST.ERROR, {
                mode: EMIT_MODES.UNICAST,
                targetId: connId,
                payload: errorPayload,
            });
            return applyResult;
        }
        const gameStateResult = this.getGameState(roomId);
        if (!gameStateResult.success || !gameStateResult.message) {
            return { success: false, message: "게임 상태 얻기 실패" };
        }
        const state = gameStateResult.message.getState();
        const checkRoom = this.checkRoom(roomId);
        if (!checkRoom.success) {
            return { success: false, message: checkRoom.message };
        }
        this.broadcastMove(roomId, sender, index.toString());
        this.broadcastNextGameState(roomId, state);
        return { success: true };
    }
    /**
     * Broadcast MOVE message indicating which player moved and to which position
     */
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
    /**
     * Broadcast next game state (either next turn or game over with winner)
     */
    broadcastNextGameState(roomId, state) {
        let nextMessage;
        if (state.status === "GAME_OVER") {
            const winner = state.winner === -2 ? "DRAW" : state.players[state.winner];
            nextMessage = { type: state.status, message: [winner], sender: "system" };
            //게임 객체삭제
            this.manager.deleteGame(roomId);
            //레디 초기화
            this.initReady(roomId);
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
    getGameState(roomId) {
        return this.manager.getGameDate(roomId);
    }
    initReady(roomId) {
        const resultCheckRoom = this.manager.getRoomData(roomId);
        if (resultCheckRoom.success) {
            const players = resultCheckRoom.message?.getAllPlayersData();
            for (const player of players) {
                this.manager.readyPlayer(roomId, player.connId, false);
            }
        }
    }
}
export default Service;
//# sourceMappingURL=Service.js.map