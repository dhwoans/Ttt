import { randomUUID } from "node:crypto";
import type RoomRegistry from "./RoomRegistry.js";
import type GameSessionManager from "./GameSessionManager.js";
import { Room } from "@ttt/core";
import type { SuccessResponse, FailureResponse, Ttt } from "@ttt/core";
import type { Nickname, RoomId, UserId } from "../type/socket.js";

class RoomService {
  constructor(private readonly roomRegistry: RoomRegistry) {}

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

  getRoomData(roomId: RoomId): SuccessResponse<Ttt> | FailureResponse {
    return this.roomRegistry.getSession(roomId);
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
    userId: UserId,
    isReady: boolean,
  ): SuccessResponse | FailureResponse {
    const sessionResult = this.roomRegistry.getSession(roomId);
    if (!sessionResult.success || !sessionResult.message) return sessionResult as FailureResponse;

    return sessionResult.message.processAction({
      type: "READY",
      userId,
      nickname: "unknown",
      isReady,
    }) as SuccessResponse<void> | FailureResponse;
  }

  gameStart(roomId: RoomId): SuccessResponse<void> | FailureResponse {
    const sessionResult = this.roomRegistry.getSession(roomId);
    if (!sessionResult.success || !sessionResult.message) {
      return { success: false, message: "방을 찾을 수 없습니다." };
    }

    const session = sessionResult.message;
    return session.processAction({
      type: "START",
      userId: "system",
      nickname: "system",
    }) as SuccessResponse<void> | FailureResponse;
  }

  getGameState(roomId: RoomId): SuccessResponse<Ttt> | FailureResponse {
    return this.roomRegistry.getSession(roomId);
  }
}

export default RoomService;
