import type Manager from "./Manager.js";
import type Room from "../models/Room.js";
import type Ttt from "../game/Ttt.js";
import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type { ConnId, Nickname, RoomId, UserId } from "../type/socket.js";
declare class Service {
    manager: Manager;
    constructor(manager: Manager);
    /**
     *
     * @param userId
     * @param nickname
     * @returns
     */
    createRoom(userId: UserId, nickname: Nickname): SuccessResponse<RoomId> | FailureResponse;
    /**
     * @description 실제로 방이 있는지 확인
     * @param {string} roomId
     * @returns {Room}
     */
    checkRoom(roomId: RoomId): SuccessResponse<Room> | FailureResponse;
    /**
     * Get room data by roomId
     * @param {string} roomId
     * @returns {Room} Room instance
     */
    getRoomData(roomId: RoomId): SuccessResponse<Room> | FailureResponse;
    /**
     *
     * @param roomId
     * @param connId
     * @returns
     */
    removePlayer(roomId: RoomId, connId: ConnId): SuccessResponse<string> | FailureResponse;
    /**
     * @description 모든 방의 roomId와 현재 플레이어 수를 반환
     * @returns {Array<object>} [{roomId: number, playerCount: number, isFull: boolean}]
     */
    getRoomList(): Array<object>;
    /**
     * Find or create a room for matchmaking
     * @returns {RoomId} The assigned room ID
     */
    findOrCreateRoom(): SuccessResponse<RoomId> | FailureResponse;
    /**
     *
     * @param roomId
     * @param connId
     * @param nickname
     * @param avatar
     * @returns
     */
    joinPlayer(roomId: RoomId, connId: ConnId, nickname: Nickname, avatar?: string): SuccessResponse<RoomId> | FailureResponse;
    /**
     * @description 플레이어 레디상태 처리
     * @param {number} roomId
     * @param {number} connId
     * @param {bool} status
     * @returns {object}
     */
    readyPlayer(roomId: RoomId, connId: ConnId, status: boolean): SuccessResponse<void> | FailureResponse;
    /**
     * @description 게임 시작 처리
     * @param {number} roomId
     * @returns {boolean}
     */
    gameStart(roomId: RoomId): SuccessResponse<void> | FailureResponse;
    /**
     * @description
     * @param message
     * @returns
     */
    setMove(rawMessage: SocketMessage): SuccessResponse<void> | FailureResponse;
    processMove(rawMessage: SocketMessage, connId: ConnId): SuccessResponse<void> | FailureResponse;
    /**
     * Broadcast MOVE message indicating which player moved and to which position
     */
    private broadcastMove;
    /**
     * Broadcast next game state (either next turn or game over with winner)
     */
    private broadcastNextGameState;
    getGameState(roomId: RoomId): SuccessResponse<Ttt> | FailureResponse;
    private initReady;
}
export default Service;
//# sourceMappingURL=Service.d.ts.map