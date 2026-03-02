import { randomUUID } from "node:crypto";
import type Manager from "./Manager.js";
import type Room from "../models/Room.js";
import type Ttt from "../game/Ttt.js";
import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type Action from "../dtos/Action.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";

import {
  eventshandler,
  EVENT_LIST,
  EMIT_MODES,
} from "../utils/eventhandler.js";
import type { ConnId, Nickname, RoomId, UserId } from "../type/socket.js";

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
    nickname: Nickname,
  ): SuccessResponse<RoomId> | FailureResponse {
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
  checkRoom(roomId: RoomId): SuccessResponse<Room> | FailureResponse {
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
    connId: ConnId,
  ): SuccessResponse<string> | FailureResponse {
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
   * Find or create a room for matchmaking
   * @returns {RoomId} The assigned room ID
   */
  findOrCreateRoom(): SuccessResponse<RoomId> | FailureResponse {
    return this.manager.findOrCreateRoom();
  }

  /**
   *
   * @param roomId
   * @param connId
   * @param nickname
   * @returns
   */
  joinPlayer(
    roomId: RoomId,
    connId: ConnId,
    nickname: Nickname,
  ): SuccessResponse<RoomId> | FailureResponse {
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
    status: boolean,
  ): SuccessResponse<void> | FailureResponse {
    return this.manager.readyPlayer(roomId, connId, status);
  }
  /**
   * @description 게임 시작 처리
   * @param {number} roomId
   * @returns {boolean}
   */
  gameStart(roomId: RoomId): SuccessResponse<void> | FailureResponse {
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
      } else {
        // 인원 부족
        return { success: false, message: "인원 부족" };
      }
    } else {
      return { success: true };
    }
  }
  /**
   * @description
   * @param message
   * @returns
   */
  setMove(rawMessage: SocketMessage): SuccessResponse<void> | FailureResponse {
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

  processMove(
    rawMessage: SocketMessage,
    connId: ConnId,
  ): SuccessResponse<void> | FailureResponse {
    const { type, message, sender } = rawMessage;
    const [roomId, index] = message;

    const action: Action = { type, move: parseInt(index!), nickname: sender };
    const applyResult = this.manager.setMove(roomId!, action);
    if (!applyResult.success) {
      // emit error to requesting client
      const errorPayload: SocketMessage = {
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

    const gameStateResult = this.getGameState(roomId!);
    if (!gameStateResult.success || !gameStateResult.message) {
      return { success: false, message: "게임 상태 얻기 실패" };
    }
    const state = gameStateResult.message.getState();

    const checkRoom = this.checkRoom(roomId!);
    if (!checkRoom.success) {
      return { success: false, message: checkRoom.message };
    }

    this.broadcastMove(roomId!, sender, index!.toString());
    this.broadcastNextGameState(roomId!, state);

    return { success: true };
  }

  /**
   * Broadcast MOVE message indicating which player moved and to which position
   */
  private broadcastMove(roomId: RoomId, sender: string, index: string): void {
    const moveMessage: SocketMessage = {
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
  private broadcastNextGameState(
    roomId: RoomId,
    state: {
      board: Array<string>;
      winner: number;
      status: string;
      players: Array<string>;
      currentTurn: number;
    },
  ): void {
    let nextMessage: SocketMessage;
    if (state.status === "GAME_OVER") {
      const winner: string =
        state.winner === -2 ? "DRAW" : state.players[state.winner]!;
      nextMessage = { type: state.status, message: [winner], sender: "system" };
      //게임 객체삭제
      this.manager.deleteGame(roomId);
      //레디 초기화
      this.initReady(roomId);
    } else {
      nextMessage = {
        type: state.status,
        message: [state.players[state.currentTurn % 2]!.toString()],
        sender: "system",
      };
    }

    eventshandler.emit(state.status, {
      mode: EMIT_MODES.BROADCAST,
      roomId,
      payload: nextMessage,
    });
  }
  getGameState(roomId: RoomId): SuccessResponse<Ttt> | FailureResponse {
    return this.manager.getGameDate(roomId);
  }
  private initReady(roomId: RoomId) {
    const resultCheckRoom = this.manager.getRoomData(roomId);
    if (resultCheckRoom.success) {
      const players = resultCheckRoom.message?.getAllPlayersData()!;
      for (const player of players) {
        this.manager.readyPlayer(roomId, player.connId, false);
      }
    }
  }
}

export default Service;
