import { randomUUID } from "node:crypto";
import type RoomRegistry from "./RoomRegistry.js";
import type GameSessionManager from "./GameSessionManager.js";
import type Room from "../models/Room.js";
import type { Ttt } from "@ttt/core";
import type { SuccessResponse } from "@ttt/core";
import type { FailureResponse } from "@ttt/core";
import type { Nickname, RoomId, UserId } from "../type/socket.js";

class RoomService {
  constructor(
    private readonly roomRegistry: RoomRegistry,
    private readonly gameSessionManager: GameSessionManager,
  ) {}

  createRoom(
    userId: UserId,
    nickname: Nickname,
  ): SuccessResponse<RoomId> | FailureResponse {
    if (!userId || !nickname) {
      throw new Error(`${this.constructor.name} : 정보가 누락되었습니다.`);
    }

    const roomId = randomUUID();
    return this.roomRegistry.createRoom(roomId);
  }

  checkRoom(roomId: RoomId): SuccessResponse<Room> | FailureResponse {
    return this.roomRegistry.getRoomData(roomId);
  }

  getRoomData(roomId: RoomId): SuccessResponse<Room> | FailureResponse {
    return this.roomRegistry.getRoomData(roomId);
  }

  removePlayer(
    roomId: RoomId,
    userId: string,
  ): SuccessResponse<string> | FailureResponse {
    return this.roomRegistry.removePlayer(roomId, userId);
  }

  getRoomList(): Array<object> {
    return this.roomRegistry.getRoomList();
  }

  findOrCreateRoom(): SuccessResponse<RoomId> | FailureResponse {
    return this.roomRegistry.findOrCreateRoom();
  }

  joinPlayer(
    roomId: RoomId,
    userId: string,
    nickname: Nickname,
    avatar?: string,
  ): SuccessResponse<RoomId> | FailureResponse {
    return this.roomRegistry.joinPlayer(roomId, userId, nickname, avatar);
  }

  readyPlayer(
    roomId: RoomId,
    userId: string,
    status: boolean,
  ): SuccessResponse<void> | FailureResponse {
    return this.roomRegistry.readyPlayer(roomId, userId, status);
  }

  gameStart(roomId: RoomId): SuccessResponse<void> | FailureResponse {
    const result = this.checkRoom(roomId);
    if (result.success && result.message) {
      const room = result.message;
      if (room.isFull()) {
        for (const { isReady } of room.getAllPlayersData()) {
          if (!isReady) {
            return { success: false, message: "레디 안함" };
          }
        }

        const playerIds = room
          .getAllPlayersData()
          .map((player) => player.userId);
        return this.gameSessionManager.startGame(roomId, playerIds);
      }

      return { success: false, message: "인원 부족" };
    }

    return { success: true };
  }

  getGameState(roomId: RoomId): SuccessResponse<Ttt> | FailureResponse {
    return this.gameSessionManager.getGameState(roomId);
  }
}

export default RoomService;
