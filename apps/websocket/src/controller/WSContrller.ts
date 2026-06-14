import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type RoomService from "../service/RoomService.js";
import type LegacyWsGameService from "../service/legacy/LegacyWsGameService.js";
import type User from "../dtos/user/User.dto.js";
import type { PlayerInfo } from "../dtos/user/User.dto.js";
import { EVENT_LIST, eventshandler } from "../utils/eventhandler.js";
import { EMIT_MODES } from "../utils/eventhandler.js";
import type { UserId } from "../type/socket.js";

class WSController {
  constructor(
    public roomService: RoomService,
    public legacyWsGameService: LegacyWsGameService,
  ) {}
  handleMove(rawMessage: SocketMessage, userId: UserId): void {
    const result = this.legacyWsGameService.processMove(rawMessage, userId);
    if (!result.success) {
      // Service already emits an error to the client, but ensure fallback emit here
      const errorPayload: SocketMessage = {
        type: "ERROR",
        message: [result.message ?? "Move failed"],
        sender: "system",
      };
      eventshandler.emit(EVENT_LIST.ERROR, {
        mode: EMIT_MODES.UNICAST,
        targetId: userId,
        payload: errorPayload,
      });
    }
  }
  handleJoin(rawMessage: SocketMessage, userId: string): void {
    const { type, message, sender } = rawMessage;
    const [roomId, joinedUserId] = message;
    const checkRoomResult = this.roomService.checkRoom(roomId!);
    if (!checkRoomResult.success) {
      const errorMessage: SocketMessage = {
        type: "ERROR",
        message: ["Invalid room access"],
        sender: "system",
      };
      eventshandler.emit(EVENT_LIST.ROOM_JOIN, {
        mode: EMIT_MODES.UNICAST,
        targetId: userId,
        payload: errorMessage,
      });
    } else {
      const room = checkRoomResult.message;
      if (!room) return;
      if (room.players.size > 0) {
        const joinMessage: SocketMessage = {
          type: "JOIN",
          message: [joinedUserId!, "false"],
          sender,
        };
        eventshandler.emit(EVENT_LIST.ROOM_JOIN, {
          mode: EMIT_MODES.EXCEPT_ME,
          roomId,
          targetId: userId,
          payload: joinMessage,
        });
      }
      const result = this.roomService.joinPlayer(roomId!, joinedUserId!, sender);
      if (result.success) {
        eventshandler.emit(EVENT_LIST.PLAYER_PLUS, roomId);
        const players = room.getAllPlayersData();
        const messageList = players.map((player: PlayerInfo) => {
          return {
            type: "JOIN",
            message: [player.userId, player.isReady.toString()],
            sender: player.nickname,
          } as SocketMessage;
        });
        messageList.forEach((message: SocketMessage) => {
          eventshandler.emit(EVENT_LIST.ROOM_JOIN, {
            mode: EMIT_MODES.UNICAST,
            targetId: userId,
            payload: message,
          });
        });
      }
    }
  }

  /**
   * Handle chat message broadcast
   */
  handleChat(rawMessage: SocketMessage): void {
    const { type, message, sender } = rawMessage;
    const [roomId, chat] = message;
    const result = this.roomService.checkRoom(roomId!);

    if (!result.success) {
      throw new Error(`Failed to relay chat: room ${roomId} not found`);
    } else {
      const chatMessage: SocketMessage = {
        type: "CHAT",
        message: [chat!],
        sender,
      };
      eventshandler.emit(EVENT_LIST.CHAT, {
        mode: EMIT_MODES.BROADCAST,
        roomId,
        payload: chatMessage,
      });
    }
  }

  /**
   * Handle player leave room
   */
  handleLeave(rawMessage: SocketMessage, userId: string): void {
    const { type, message, sender } = rawMessage;
    const [roomId] = message;
    const removePlayerResult = this.roomService.removePlayer(roomId!, userId);
    if (removePlayerResult.success) {
      const message = removePlayerResult.message as string;
      eventshandler.emit(message as any, roomId);
      if (message === EVENT_LIST.PLAYER_MINUS) {
        const leaveMessage: SocketMessage = {
          type: "LEAVE",
          message: [userId, sender],
          sender: "system",
        };
        eventshandler.emit(EVENT_LIST.LEAVE, {
          mode: EMIT_MODES.BROADCAST,
          roomId,
          payload: leaveMessage,
        });
      }
    } else {
      throw new Error(`Failed to process player leave: roomId=${roomId}`);
    }
  }
  /**
   * Handle player ready status and game start check
   */
  handleReady(rawMessage: SocketMessage, userId: string) {
    const { type, message, sender } = rawMessage;
    const [roomId, status] = message;
    const result = this.roomService.readyPlayer(
      roomId!,
      userId,
      Boolean(status!),
    );
    if (result.success) {
      const readyMessage: SocketMessage = {
        type: "READY",
        message: [userId, status!],
        sender: "system",
      };
      const checkRoomResult = this.roomService.checkRoom(roomId!);
      if (checkRoomResult.success) {
        eventshandler.emit(EVENT_LIST.READY, {
          mode: EMIT_MODES.BROADCAST,
          roomId,
          payload: readyMessage,
        });
      } else {
        throw Error(checkRoomResult.message ?? "Unknown error");
      }
    }

    const startGame = this.roomService.gameStart(roomId!);
    if (startGame.success) {
      const resultGameState = this.roomService.getGameState(roomId!);
      if (resultGameState.success && resultGameState.message) {
        const state = resultGameState.message.getState();
        const startMessage: SocketMessage = {
          type: state.status,
          message: [state.players[state.currentTurn]!.toString()],
          sender: "system",
        };
        const checkRoomResult = this.roomService.checkRoom(roomId!);
        if (checkRoomResult.success && checkRoomResult.message) {
          eventshandler.emit(EVENT_LIST.PLAYING, {
            mode: EMIT_MODES.BROADCAST,
            roomId,
            payload: startMessage,
          });
        } else {
          throw Error(
            checkRoomResult.success
              ? "Unknown error"
              : typeof checkRoomResult.message === "string"
                ? checkRoomResult.message
                : "Unknown error",
          );
        }
      }
    }
  }
}

export default WSController;


