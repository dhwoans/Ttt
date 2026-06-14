import Room from "../models/Room.js";
import { EVENT_LIST } from "../utils/eventhandler.js";
import type { SuccessResponse } from "@ttt/core";
import type { FailureResponse } from "@ttt/core";
import type { Nickname, RoomId } from "../type/socket.js";
import { randomUUID } from "node:crypto";

class RoomRegistry {
  private readonly rooms = new Map<RoomId, Room>();

  createRoom(roomId: RoomId): SuccessResponse<RoomId> | FailureResponse {
    this.rooms.set(roomId, new Room(2));
    if (!this.rooms.get(roomId)) {
      return {
        success: false,
        message: `Failed to create room: ${roomId}`,
      };
    }

    return { success: true, message: roomId };
  }

  getRoomData(roomId: RoomId): SuccessResponse<Room> | FailureResponse {
    const room = this.rooms.get(roomId);
    if (room) {
      return { success: true, message: room };
    }

    return { success: false, message: `Room not found: ${roomId}` };
  }

  joinPlayer(
    roomId: RoomId,
    userId: string,
    nickname: Nickname,
    avatar?: string,
  ): SuccessResponse<RoomId> | FailureResponse {
    const room = this.rooms.get(roomId);
    if (!room || room.isFull()) {
      return {
        success: false,
        message: `Cannot join room ${roomId}: room not found or full`,
      };
    }

    room.addPlayer(userId, nickname, avatar);
    return { success: true, message: roomId };
  }

  removePlayer(
    roomId: RoomId,
    userId: string,
  ): SuccessResponse<string> | FailureResponse {
    const room = this.rooms.get(roomId);

    if (!room) {
      return {
        success: false,
        message: `Failed to remove player: room ${roomId} not found`,
      };
    }

    room.removePlayer(userId);
    if (room.players.size === 0) {
      this.rooms.delete(roomId);
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

    for (const roomId of this.rooms.keys()) {
      const room = this.rooms.get(roomId);
      if (!room) {
        throw new Error(`Room data inconsistency: roomId=${roomId}`);
      }

      if (room.players.size === 0) {
        this.rooms.delete(roomId);
        continue;
      }

      roomList.push({
        roomId,
        isFull: room.isFull(),
        currentPlayers: room.players.size,
        maxPlayers: room.MAX_PLAYERS,
      });
    }

    return roomList;
  }

  findOrCreateRoom(): SuccessResponse<RoomId> | FailureResponse {
    for (const [roomId, room] of this.rooms.entries()) {
      if (!room.isFull()) {
        console.log(`[RoomRegistry] Found available room: ${roomId}`);
        return { success: true, message: roomId };
      }
    }

    const newRoomId = randomUUID();
    const created = this.createRoom(newRoomId);
    if (!created.success) {
      return { success: false, message: "Failed to find or create room" };
    }

    console.log(`[RoomRegistry] Created new room: ${newRoomId}`);
    return { success: true, message: newRoomId };
  }

  readyPlayer(
    roomId: RoomId,
    userId: string,
    status: boolean,
  ): SuccessResponse | FailureResponse {
    const player = this.rooms.get(roomId)?.getPlayerDate(userId);
    if (!player) {
      return {
        success: false,
        message: `Player not found: roomId=${roomId}, userId=${userId}`,
      };
    }

    player.isReady = status;
    return { success: true };
  }
}

export default RoomRegistry;


