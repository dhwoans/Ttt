import { Namespace, Server, Socket } from "socket.io";
import Receiver from "../Receiver.js";
import { eventshandler, EVENT_LIST } from "../../utils/eventhandler.js";
import type { ConnId, EmitContext, RoomId } from "../../../type/socket.js";
import { EMIT_MODES } from "../../../type/socket.js";
import type { NextFunction } from "express";
import type SocketMessage from "../../dtos/SocketMessage.dto.js";
class RoomIOManager {
  room: Namespace;
  receiver: Receiver;

  session: Map<string, ConnId> = new Map();
  users: Map<ConnId, string> = new Map();

  constructor(room: Namespace, reciever: Receiver) {
    this.room = room;
    this.receiver = reciever;
  }

  setupEventListeners() {
    this.room.on("connection", (socket: Socket) => {
      const roomId: RoomId = socket.handshake.auth?.roomId;
      const userId: ConnId = socket.handshake.auth?.userId;

      if (!roomId || !userId) {
        console.error(`[RoomIOManager] Invalid connection attempt - roomId: ${roomId}, userId: ${userId}`);
        socket.disconnect();
        return;
      }

      this.session.set(socket.id, userId);
      this.users.set(userId, socket.id);
      socket.join(roomId);
      console.log(
        `[RoomIOManager] Connection established - socketId: ${socket.id}, roomId: ${roomId}, userId: ${userId}`
      );
      this.connection(socket);
    });
  }
  /**
   * Handle client disconnection and cleanup session
   */
  connection(socket: Socket) {
    socket.on("disconnect", (reason: string) => {
      const userId = this.session.get(socket.id);
      console.log(
        `[RoomIOManager] Disconnect - socketId: ${socket.id}, userId: ${userId}, reason: ${reason}`
      );
      this.session.delete(socket.id);
      if (userId) {
        const storedSocketId = this.users.get(userId);
        if (storedSocketId === socket.id) {
          this.users.delete(userId);
        }
      }
    });
    // client event listen
    [
      EVENT_LIST.ROOM_JOIN,
      EVENT_LIST.MOVE,
      EVENT_LIST.LEAVE,
      EVENT_LIST.CHAT,
      EVENT_LIST.READY,
    ].forEach((event) => {
      socket.on(event, (data) => {
        const userId = this.session.get(socket.id);
        if (!userId) {
          console.error(`[RoomIOManager] User mapping missing for socketId: ${socket.id}`);
          return;
        }
        this.receiver.handleMessage(data, userId);
      });
    });
  }

  /**
   * Relay events to clients based on emit mode (UNICAST, BROADCAST, EXCEPT_ME)
   */
  sendEvent() {
    [
      EVENT_LIST.ROOM_JOIN,
      EVENT_LIST.LEAVE,
      EVENT_LIST.CHAT,
      EVENT_LIST.READY,
      EVENT_LIST.MOVE,
      EVENT_LIST.PLAYING,
      EVENT_LIST.GAME_OVER,
      EVENT_LIST.ERROR,
    ].forEach((eventName) => {
      eventshandler.on(eventName, (emitContext: EmitContext) => {
        const { mode, roomId, payload } = emitContext;
        if (payload === undefined && roomId) {
          console.error(
            `[RoomIOManager] Payload missing for event: ${eventName}, roomId: ${roomId}`
          );
          return;
        }
        console.log(
          `[RoomIOManager] Emitting ${eventName} - ${JSON.stringify(emitContext)} `
        );
        this.relayEvent(eventName, emitContext);
      });
    });
  }

  private relayEvent(
    eventName: string,
    { mode, roomId, targetId, payload }: EmitContext
  ) {
    if (mode === EMIT_MODES.BROADCAST) {
      this.room.to(roomId).emit(eventName, payload);
    } else if (mode === EMIT_MODES.EXCEPT_ME) {
      const socketId = this.users.get(targetId);
      if (!socketId) {
        console.error(`[RoomIOManager] Socket mapping not found for userId: ${targetId}`);
        return;
      }
      this.room.to(roomId).except(socketId).emit(eventName, payload);
    } else if (mode === EMIT_MODES.UNICAST) {
      const socketId = this.users.get(targetId);
      if (!socketId) {
        console.error(`[RoomIOManager] Socket mapping not found for userId: ${targetId}`);
        return;
      }
      const targetSocket = this.room.sockets.get(socketId);
      if (!targetSocket) {
        console.error(`[RoomIOManager] Socket instance not found for socketId: ${socketId}`);
        return;
      }
      targetSocket.emit(eventName, payload);
    }
  }
}

export default RoomIOManager;
