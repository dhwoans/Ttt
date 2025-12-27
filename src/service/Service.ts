import { randomUUID } from "node:crypto";
import type Manager from "./Manager.js";
import type Room from "../models/Room.js";
import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type Action from "../dtos/Action.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type { ConnId, Nickname, RoomId, UserId } from "../../type/socket.js";

class Service {
  manager: Manager;
  constructor(manager: Manager) {
    this.manager = manager;
  }
  /**
   *
   * @param userId
   * @param nickname
   * @returns
   */
  createRoom(
    userId: UserId,
    nickname: Nickname
  ): SuccessResponse | FailureResponse {
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
  checkRoom(roomId: RoomId): SuccessResponse | FailureResponse {
    return this.manager.getRoomData(roomId);
  }
  /**
   *
   * @param roomId
   * @param connId
   * @returns
   */
  removePlayer(
    roomId: RoomId,
    connId: ConnId
  ): SuccessResponse | FailureResponse {
    return this.manager.removePlayer(roomId, connId);
  }

  /**
   * @description 모든 방의 roomId와 현재 플레이어 수를 반환
   * @returns {Array<object>} [{roomId: number, playerCount: number, isFull: boolean}]
   */
  getRoomList(): Array<object> {
    return this.manager.getRoomList();
  }

  /**
   * @description 플레이어 입장 처리
   * @param {number} roomId
   * @param {number} connId
   * @param {number} nickname
   * @returns {object}
   */
  joinPlayer(
    roomId: RoomId,
    connId: ConnId,
    nickname: Nickname
  ): SuccessResponse | FailureResponse {
    return this.manager.joinPlayer(roomId, connId, nickname);
  }

  /**
   * @description 플레이어 레디상태 처리
   * @param {number} roomId
   * @param {number} connId
   * @param {bool} status
   * @returns {object}
   */
  readyPlayer(
    roomId: RoomId,
    connId: ConnId,
    status: boolean
  ): SuccessResponse | FailureResponse {
    return this.manager.readyPlayer(roomId, connId, status);
  }
  /**
   * @description 게임 시작 처리
   * @param {number} roomId
   * @returns {boolean}
   */
  gameStart(roomId: RoomId): SuccessResponse | FailureResponse {
    // 레디 검증
    const result = this.checkRoom(roomId);
    if (result) {
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
      } else {
        // 인원 부족
        return { success: false, message: "인원 부족" };
      }
    } else {
      return result;
    }
  }
  /**
   * @description
   * @param message
   * @returns
   */
  setMove(rawMessage: SocketMessage): SuccessResponse | FailureResponse {
    const { type, message, sender } = rawMessage;
    const [roomId, index] = rawMessage.message;
    //message -> action
    const action: Action = {
      type,
      move: parseInt(index!),
      nickname: sender,
    };

    return this.manager.setMove(roomId!, action);
  }
  getGameState(roomId: RoomId): SuccessResponse | FailureResponse {
    return this.manager.getGameDate(roomId);
  }
}

export default Service;
