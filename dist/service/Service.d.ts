import type Manager from "../models/Manager.js";
import type Room from "../models/Room.js";
import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
declare class Service {
    manager: Manager;
    constructor(manager: Manager);
    /**
     * @description 방 생성
     * @param {number} userId
     * @param {string} nickname
     * @returns {number} roomId
     */
    createRoom(userId: number, nickname: string): number;
    /**
     * @description 실제로 방이 있는지 확인
     * @param {number} roomId
     * @returns {Room}
     */
    checkRoom(roomId: number): Room;
    /**
     *
     * @param roomId
     * @param connId
     * @returns
     */
    removePlayer(roomId: number, connId: number): SuccessResponse | FailureResponse;
    /**
     * @description 모든 방의 roomId와 현재 플레이어 수를 반환
     * @returns {Array<object>} [{roomId: number, playerCount: number, isFull: boolean}]
     */
    getRoomList(): Array<object>;
    /**
     * @description 플레이어 입장 처리
     * @param {number} roomId
     * @param {number} connId
     * @param {number} nickname
     * @returns {object}
     */
    joinPlayer(roomId: number, connId: number, nickname: string): SuccessResponse | FailureResponse;
    /**
     * @description 플레이어 레디상태 처리
     * @param {number} roomId
     * @param {number} connId
     * @param {bool} status
     * @returns {object}
     */
    readyPlayer(roomId: number, connId: number, status: boolean): SuccessResponse | FailureResponse;
    /**
     * @description 게임 시작 처리
     * @param {number} roomId
     * @returns {boolean}
     */
    gameStart(roomId: number): SuccessResponse | FailureResponse;
    /**
     * @description
     * @param message
     * @returns
     */
    setMove(rawMessage: SocketMessage): SuccessResponse | FailureResponse;
    getGameState(roomId: number): {
        board: Array<string>;
        winner: number;
        status: string;
        players: Array<number>;
        currentTurn: number;
    };
}
export default Service;
//# sourceMappingURL=Service.d.ts.map