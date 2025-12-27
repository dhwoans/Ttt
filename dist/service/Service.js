import { randomUUID } from "node:crypto";
class Service {
    manager;
    constructor(manager) {
        this.manager = manager;
    }
    /**
     * @description 방 생성
     * @param {number} userId
     * @param {string} nickname
     * @returns {number} roomId
     */
    createRoom(userId, nickname) {
        if (!userId || !nickname) {
            throw new Error(`${this.constructor.name} : 정보가 누락되었습니다.`);
        }
        const roomId = parseInt(randomUUID());
        const result = this.manager.createRoom(roomId);
        if (result.success) {
            return roomId;
        }
        else {
            throw new Error(`${this.constructor.name} : 방생성 실패`);
        }
    }
    /**
     * @description 실제로 방이 있는지 확인
     * @param {number} roomId
     * @returns {Room}
     */
    checkRoom(roomId) {
        const room = this.manager.getRoomData(roomId);
        if (room) {
            return room;
        }
        else {
            throw new Error(`${this.constructor.name} : room 정보 확인 불가`);
        }
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
     * @description 플레이어 입장 처리
     * @param {number} roomId
     * @param {number} connId
     * @param {number} nickname
     * @returns {object}
     */
    joinPlayer(roomId, connId, nickname) {
        return this.manager.joinPlayer(roomId, connId, nickname);
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
        const room = this.checkRoom(roomId);
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
        return this.manager.setMove(parseInt(roomId), action);
    }
    getGameState(roomId) {
        const game = this.manager.getGameDate(roomId);
        return game.getState();
    }
}
export default Service;
//# sourceMappingURL=Service.js.map