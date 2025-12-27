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
        console.error(`[ROOM] 잘못된 연결: roomId=${roomId}, userId=${userId}`);
        socket.disconnect();
        return;
      }

      this.session.set(socket.id, userId);
      // 유지: userId -> socketId 매핑
      this.users.set(userId, socket.id);
      socket.join(roomId);
      console.log(
        `[ROOM] 연결 성공! socketId: ${socket.id}, roomId: ${roomId}, userId: ${userId}`
      );
      this.connection(socket);
    });
  }
  /**
   *
   * @param socket
   */
  connection(socket: Socket) {
    socket.on("disconnect", (reason: string) => {
      const userId = this.session.get(socket.id);
      console.log(
        `[ROOM] 클라이언트 ${socket.id} 연결해제. userId: ${userId}, 사유: ${reason}`
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
          console.error(`[ERROR] socketId ${socket.id}에 userId 없음`);
          return;
        }
        this.receiver.handleMessage(data, userId);
      });
    });
  }

  /**
   * @description send server result to client
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
          // signature: (packet)
          console.log(
            `[${this.constructor.name}] ERROR: ${JSON.stringify(roomId)}`
          );
          return;
        }
        console.log(
          `[${this.constructor.name}] : ${eventName}  event. ${JSON.stringify(
            emitContext
          )} `
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
      //targetRoomId
      this.room.to(roomId).emit(eventName, payload);
    } else if (mode === EMIT_MODES.EXCEPT_ME) {
      const socketId = this.users.get(targetId);
      if (!socketId) {
        console.error(`[ERROR] User ${targetId} not found in mapping`);
        return;
      }
      this.room.to(roomId).except(socketId).emit(eventName, payload);
    } else if (mode === EMIT_MODES.UNICAST) {
      //targetSocketId
      const socketId = this.users.get(targetId);
      if (!socketId) {
        console.error(`[ERROR] User ${targetId} not found in mapping`);
        return;
      }
      const targetSocket = this.room.sockets.get(socketId);
      if (!targetSocket) {
        console.error(`[ERROR] Socket ${socketId} not found`);
        return;
      }
      targetSocket.emit(eventName, payload);
    }
  }
}

export default RoomIOManager;
