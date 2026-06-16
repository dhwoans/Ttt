import { Ttt } from "@ttt/core";
import { EVENT_LIST } from "../utils/eventhandler.js";
import type { SuccessResponse, FailureResponse } from "@ttt/core";
import type { Nickname, RoomId, UserId } from "../type/socket.js";
import { randomUUID } from "node:crypto";

class RoomRegistry {
  private readonly sessions = new Map<RoomId, Ttt>();

  createRoom(roomId: RoomId): SuccessResponse<RoomId> | FailureResponse {
    const session = new Ttt();
    session.tree.game.roomId = roomId;
    this.sessions.set(roomId, session);
    return { success: true, message: roomId };
  }

  getSession(roomId: RoomId): SuccessResponse<Ttt> | FailureResponse {
    const session = this.sessions.get(roomId);
    if (session) {
      return { success: true, message: session };
    }
    return { success: false, message: `Room session not found: ${roomId}` };
  }

  joinPlayer(
    roomId: RoomId,
    userId: UserId,
    nickname: Nickname,
    avatar?: string,
  ): SuccessResponse<RoomId> | FailureResponse {
    const session = this.sessions.get(roomId);
    if (!session) {
      return { success: false, message: `Room ${roomId} not found` };
    }

    if (session.tree.players.length >= 2) {
      return { success: false, message: `Room ${roomId} is full` };
    }

    session.addPlayer(userId, nickname, avatar);
    return { success: true, message: roomId };
  }

  removePlayer(
    roomId: RoomId,
    userId: UserId,
  ): SuccessResponse<string> | FailureResponse {
    const session = this.sessions.get(roomId);
    if (!session) {
      return { success: false, message: `Room ${roomId} not found` };
    }

    session.removePlayer(userId);
    if (session.tree.players.length === 0) {
      this.sessions.delete(roomId);
      return { success: true, message: EVENT_LIST.ROOM_REMOVE };
    }

    return { success: true, message: EVENT_LIST.PLAYER_MINUS };
  }

  getRoomList(): Array<{
    roomId: RoomId;
    isFull: boolean;
    currentPlayers: number;
    maxPlayers: number;
  }> {
    const roomList = [];
    for (const [roomId, session] of this.sessions.entries()) {
      roomList.push({
        roomId,
        isFull: session.tree.players.length >= 2,
        currentPlayers: session.tree.players.length,
        maxPlayers: 2,
      });
    }
    return roomList;
  }

  findOrCreateRoom(): SuccessResponse<RoomId> | FailureResponse {
    for (const [roomId, session] of this.sessions.entries()) {
      if (session.tree.players.length < 2) {
        return { success: true, message: roomId };
      }
    }

    const newRoomId = randomUUID();
    const created = this.createRoom(newRoomId);
    return created;
  }
}

export default RoomRegistry;
