import Ttt from "../game/Ttt.js";
import Room from "../models/Room.js";
import PlayingState from "../gameState/PlayingState.js";
import type User from "../dtos/user/User.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type Action from "../dtos/Action.dto.js";
import { EVENT_LIST } from "../utils/eventhandler.js";
import type { ConnId, Nickname, RoomId } from "../type/socket.js";
import { randomUUID } from "node:crypto";
class Manager {
  rooms: Map<RoomId, Room>;
  games: Map<RoomId, Ttt>;

  constructor() {
    this.rooms = new Map();
    this.games = new Map();
  }

  /* ========================================================= */
  /* 대기실 관리                                                    */
  /* ========================================================= */

  /**
   * 새로운 방을 생성하고 두 인스턴스를 Map에 저장
   * @param {number} roomId
   * @returns {number}
   */
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

  /**
   * Retrieve room data by roomId
   */
  getRoomData(roomId: RoomId): SuccessResponse<Room> | FailureResponse {
    const room = this.rooms.get(roomId);
    if (room) return { success: true, message: room as Room };
    else {
      return { success: false, message: `Room not found: ${roomId}` };
    }
  }

  /**
   * Handle player join
   */
  joinPlayer(
    roomId: RoomId,
    connId: ConnId,
    nickname: Nickname,
  ): SuccessResponse<RoomId> | FailureResponse {
    const room = this.rooms.get(roomId);
    if (!room || room.isFull()) {
      return {
        success: false,
        message: `Cannot join room ${roomId}: room not found or full`,
      };
    }
    room.addPlayer(connId, nickname);
    return { success: true, message: roomId };
  }

  /**
   * Handle player leave
   */
  removePlayer(
    roomId: RoomId,
    connId: ConnId,
  ): SuccessResponse<string> | FailureResponse {
    const room = this.rooms.get(roomId);

    if (room) {
      room.removePlayer(connId);
      if (room.players.size === 0) {
        this.rooms.delete(roomId);
        return { success: true, message: EVENT_LIST.ROOM_REMOVE };
      } else {
        return { success: true, message: EVENT_LIST.PLAYER_MINUS };
      }
    } else {
      return {
        success: false,
        message: `Failed to remove player: room ${roomId} not found`,
      };
    }
  }

  /**
   * Get all rooms with player count and capacity info
   */
  getRoomList(): Array<{
    roomId: RoomId;
    isFull: boolean;
    currentPlayers: number;
    maxPlayers: number;
  }> {
    const roomList = [];
    for (const roomId of this.rooms.keys()) {
      const room = this.rooms.get(roomId);
      if (room) {
        if (room.players.size === 0) {
          this.rooms.delete(roomId);
        } else {
          roomList.push({
            roomId: roomId,
            isFull: room.isFull(),
            currentPlayers: room.players.size,
            maxPlayers: room.MAX_PLAYERS,
          });
        }
      } else {
        throw new Error(`Room data inconsistency: roomId=${roomId}`);
      }
    }
    return roomList;
  }

  /**
   * Find an available room or create a new one for matchmaking
   * @returns Available roomId
   */
  findOrCreateRoom(): SuccessResponse<RoomId> | FailureResponse {
    // Find a room that is not full
    for (const [roomId, room] of this.rooms.entries()) {
      if (!room.isFull()) {
        console.log(`[Manager] Found available room: ${roomId}`);
        return { success: true, message: roomId };
      }
    }

    // No available room found, create a new one
    const newRoomId = randomUUID();
    const result = this.createRoom(newRoomId);

    if (result.success) {
      console.log(`[Manager] Created new room: ${newRoomId}`);
      return { success: true, message: newRoomId };
    }

    return { success: false, message: "Failed to find or create room" };
  }
  /**
   * Handle player ready status change
   */
  readyPlayer(
    roomId: RoomId,
    connId: ConnId,
    status: boolean,
  ): SuccessResponse | FailureResponse {
    const player = this.rooms.get(roomId)?.getPlayerDate(connId);
    if (player) {
      player.isReady = status;
      return { success: true };
    } else
      return {
        success: false,
        message: `Player not found: roomId=${roomId}, connId=${connId}`,
      };
  }

  /* ========================================================= */
  /* 게임 관리                                                   */
  /* ========================================================= */

  getGameDate(roomId: RoomId): SuccessResponse<Ttt> | FailureResponse {
    const game = this.games.get(roomId);
    if (!game) {
      return {
        success: false,
        message: `Game state not found: roomId=${roomId}`,
      };
    }
    return { success: true, message: game as Ttt };
  }

  gameStart(roomId: RoomId): SuccessResponse | FailureResponse {
    this.games.set(roomId, new Ttt());
    const game = this.games.get(roomId);
    const room = this.rooms.get(roomId);
    if (game && room) {
      for (const info of room.getAllPlayersData()) {
        game.setPlayersId(info.connId);
      }
      game.changeState(new PlayingState());
      const state = game.getState();
      if (state.status !== "PLAYING")
        return {
          success: false,
          message: `Failed to start game: invalid state ${state.status}`,
        };
      if (state.players.length !== 2)
        return {
          success: false,
          message: `Failed to start game: insufficient players (${state.players.length}/2)`,
        };
      return { success: true };
    } else {
      return {
        success: false,
        message: `Failed to start game: game=${
          game ? "exists" : "missing"
        }, room=${room ? "exists" : "missing"}`,
      };
    }
  }
  deleteGame(roomId: RoomId): SuccessResponse | FailureResponse {
    this.games.delete(roomId);
    if (this.games.get(roomId)) {
      return { success: false, message: "게임 삭제 실패" };
    } else {
      return { success: true };
    }
  }
  /**
   * Process player move action
   */
  setMove(roomId: RoomId, message: Action): SuccessResponse | FailureResponse {
    const game = this.games.get(roomId);
    if (game) {
      const state = game.getState();
      if (state.status !== "PLAYING") {
        return {
          success: false,
          message: "Game is not in PLAYING state",
        };
      }
      return game.processAction(message) as
        | SuccessResponse<void>
        | FailureResponse;
    } else {
      return {
        success: false,
        message: `Game instance not found: roomId=${roomId}`,
      };
    }
  }
}
export default Manager;
