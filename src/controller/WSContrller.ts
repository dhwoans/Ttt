import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type Service from "../service/Service.js";
import type User from "../dtos/user/User.dto.js";
import type { PlayerInfo } from "../dtos/user/User.dto.js";
import { EVENT_LIST, eventshandler } from "../utils/eventhandler.js";
import { EMIT_MODES } from "../../type/socket.js";

class WSController {
  constructor(public service: Service) {}

  /* ========================================================= */
  /* WS  처리                                                   */
  /* ========================================================= */

  /**
   * Handle player join room
   */
  handleJoin(rawMessage: SocketMessage, connId: string): void {
    const { type, message, sender } = rawMessage;
    const [roomId, userId] = message;
    const checkRoomResult = this.service.checkRoom(roomId!);
    if (!checkRoomResult.success) {
      const errorMessage: SocketMessage = {
        type: "ERROR",
        message: ["Invalid room access"],
        sender: "system",
      };
      eventshandler.emit(EVENT_LIST.ROOM_JOIN, {
        mode: EMIT_MODES.UNICAST,
        connId,
        payload: errorMessage,
      });
    } else {
      const room = checkRoomResult.message;
      if (!room) return;
      if (room.players.size > 0) {
        const joinMessage: SocketMessage = {
          type: "JOIN",
          message: [userId!, "false"],
          sender,
        };
        eventshandler.emit(EVENT_LIST.ROOM_JOIN, {
          mode: EMIT_MODES.EXCEPT_ME,
          roomId,
          targetId: connId,
          payload: joinMessage,
        });
      }
      const result = this.service.joinPlayer(roomId!, userId!, sender);
      if (result.success) {
        eventshandler.emit(EVENT_LIST.PLAYER_PLUS, roomId);
        const players = room.getAllPlayersData();
        const messageList = players.map((player: PlayerInfo) => {
          return {
            type: "JOIN",
            message: [player.connId, player.isReady.toString()],
            sender: player.nickname,
          } as SocketMessage;
        });
        messageList.forEach((message: SocketMessage) => {
          eventshandler.emit(EVENT_LIST.ROOM_JOIN, {
            mode: EMIT_MODES.UNICAST,
            targetId: connId,
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
    const result = this.service.checkRoom(roomId!);

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
  handleLeave(rawMessage: SocketMessage, connId: string): void {
    const { type, message, sender } = rawMessage;
    const [roomId] = message;
    const removePlayerResult = this.service.removePlayer(roomId!, connId);
    if (removePlayerResult.success) {
      const message = removePlayerResult.message as string;
      eventshandler.emit(message as any, roomId);
      if (message === EVENT_LIST.PLAYER_MINUS) {
        const leaveMessage: SocketMessage = {
          type: "LEAVE",
          message: [connId, sender],
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
  handleReady(rawMessage: SocketMessage, connId: string) {
    const { type, message, sender } = rawMessage;
    const [roomId, status] = message;
    const result = this.service.readyPlayer(roomId!, connId, Boolean(status!));
    if (result.success) {
      const readyMessage: SocketMessage = {
        type: "READY",
        message: [connId, status!],
        sender: "system",
      };
      const checkRoomResult = this.service.checkRoom(roomId!);
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

    const startGame = this.service.gameStart(roomId!);
    if (startGame.success) {
      const resultGameState = this.service.getGameState(roomId!);
      if (resultGameState.success && resultGameState.message) {
        const state = resultGameState.message.getState();
        const startMessage: SocketMessage = {
          type: state.status,
          message: [state.players[state.currentTurn]!.toString()],
          sender: "system",
        };
        const checkRoomResult = this.service.checkRoom(roomId!);
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
              : "Unknown error"
          );
        }
      }
    }
  }
  /**
   * Handle player move action
   */
  handleMove(rawMessage: SocketMessage, connId: string): void {
    const result = this.service.setMove(rawMessage);
    if (result.success) {
      const { type, message, sender } = rawMessage;
      const [roomId, index] = message;
      const resultGameState = this.service.getGameState(roomId!);
      if (!resultGameState.success || !resultGameState.message) {
        throw Error(
          resultGameState.message
            ? String(resultGameState.message)
            : "Failed to get game state"
        );
      }
      const state = resultGameState.message.getState();
      const moveMessage: SocketMessage = {
        type: "MOVE",
        message: [sender, index!.toString()],
        sender: "system",
      };
      console.log("[WSController] Game state:", state);
      let nextMessage: SocketMessage;
      if (state.status === "GAME_OVER") {
        const winner: string =
          state.winner === -2
            ? "DRAW"
            : state.players[state.winner] ?? "Unknown";
        nextMessage = {
          type: state.status,
          message: [winner],
          sender: "system",
        };
      } else {
        nextMessage = {
          type: state.status,
          message: [state.players[state.currentTurn % 2]!.toString()],
          sender: "system",
        };
      }
      const checkRoomResult = this.service.checkRoom(roomId!);
      if (checkRoomResult.success) {
        eventshandler.emit(EVENT_LIST.MOVE, {
          mode: EMIT_MODES.BROADCAST,
          roomId,
          payload: moveMessage,
        });
        eventshandler.emit(state.status, {
          mode: EMIT_MODES.BROADCAST,
          roomId,
          payload: nextMessage,
        });
      } else {
        throw Error(checkRoomResult.message ?? "Unknown error");
      }
    } else {
      const errorMessage: SocketMessage = {
        type: "ERROR",
        message: [result.message],
        sender: "system",
      };
      eventshandler.emit(EVENT_LIST.ERROR, {
        mode: EMIT_MODES.UNICAST,
        targetId: connId,
        payload: errorMessage,
      });
    }
  }
}

export default WSController;
