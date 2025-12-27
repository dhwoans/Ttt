import Ttt from "../game/Ttt.js";
import Room from "./Room.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type Action from "../dtos/Action.dto.js";
declare class Manager {
    rooms: Map<number, Room>;
    games: Map<number, Ttt>;
    constructor();
    /**
     * 새로운 방을 생성하고 두 인스턴스를 Map에 저장
     * @param {number} roomId
     * @returns {number}
     */
    createRoom(roomId: number): SuccessResponse | FailureResponse;
    /**
     * 방정보 반환
     * @param {number} roomId
     * @returns {object}
     */
    getRoomData(roomId: number): Room;
    /**
     * 플레이어 입장 처리
     * @param {number} roomId
     * @param {number} connId
     * @param {number} nickname
     * @returns {object}
     */
    joinPlayer(roomId: number, connId: number, nickname: string): SuccessResponse | FailureResponse;
    /**
     * 플레이어 퇴장 처리
     * @param {number} roomId
     * @param {number} connId
     * @param {number} nickname
     * @returns {Room}
     */
    removePlayer(roomId: number, connId: number): SuccessResponse | FailureResponse;
    /**
     * 모든 방의 roomId와 현재 플레이어 수를 반환
     * @returns {Array<object>} [{roomId: number, playerCount: number, isFull: boolean}]
     */
    getRoomList(): Array<object>;
    /**
     *
     * @param roomId
     * @param connId
     * @param status
     * @returns
     */
    readyPlayer(roomId: number, connId: number, status: boolean): SuccessResponse | FailureResponse;
    /**
     * @description 게임 상태 조회
     * @param roomId
     * @returns Ttt
     */
    getGameDate(roomId: number): Ttt;
    /**
     * @description 게임 시작
     * @param roomId
     * @returns
     */
    gameStart(roomId: number): SuccessResponse | FailureResponse;
    /**
     * @description 플레이어 행동처리
     * @param roomId
     * @param message
     * @returns
     */
    setMove(roomId: number, message: Action): SuccessResponse | FailureResponse;
}
export default Manager;
//# sourceMappingURL=Manager.d.ts.map