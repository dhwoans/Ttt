import { Namespace, Server, Socket } from "socket.io";
import { eventshandler, EVENT_LIST } from "../../utils/eventhandler.js";
import type { RoomId, roomInfo } from "../../type/socket.js";
import type Service from "../../service/Service.js";

class LobbyIOManager {
  lobby: Namespace;
  session: Map<string, string>;
  service: Service;

  constructor(lobby: Namespace, service: Service) {
    this.lobby = lobby;
    this.session = new Map();
    this.service = service;
  }

  setupEventListeners() {
    this.lobby.on("connection", (socket: Socket) => {
      console.log(
        `[LobbyIOManager] Connection established - socketId: ${socket.id}`,
      );

      // 티켓 검증 및 방 배정
      const ticket = socket.handshake.auth?.ticket;
      const userId = socket.handshake.auth?.userId;

      if (ticket && userId) {
        console.log(
          `[LobbyIOManager] Ticket received: ${ticket}, userId: ${userId}`,
        );

        // TODO: Redis에서 티켓 유효성 검증
        // const isValid = await redis.get(ticket);
        // if (!isValid) {
        //   socket.emit("ERROR", { message: "Invalid or expired ticket" });
        //   socket.disconnect();
        //   return;
        // }

        // 사용 가능한 방 찾기 또는 새로 생성
        const result = this.service.findOrCreateRoom();

        if (result.success && result.message) {
          const assignedRoomId = result.message;
          console.log(
            `[LobbyIOManager] Room assigned: ${assignedRoomId} for user: ${userId}`,
          );

          // 클라이언트에 방 배정 알림
          socket.emit("ROOM_ASSIGNED", { roomId: assignedRoomId });

          // TODO: Redis에서 티켓 삭제 (일회용)
          // await redis.del(ticket);
        } else {
          socket.emit("ERROR", { message: "Failed to assign room" });
          socket.disconnect();
        }
      }

      this.connection(socket);
    });
  }

  connection(socket: Socket) {
    socket.on("disconnect", (reason: string) => {
      console.log(
        `[LobbyIOManager] Disconnect - socketId: ${socket.id}, reason: ${reason}`,
      );
      this.session.delete(socket.id);
    });

    socket.on("joinLobby", (data) => {
      console.log(
        `[LobbyIOManager] joinLobby received from socketId: ${
          socket.id
        }, data: ${JSON.stringify(data)}`,
      );
      this.lobby.to(socket.id).emit("joinLobby", { status: "success" });
    });
  }

  sendEvent() {
    eventshandler.on(EVENT_LIST.ROOM_CREATE, (data: roomInfo) => {
      console.log(`[LobbyIOManager] Emitting room create event`);
      this.lobby.emit(EVENT_LIST.ROOM_CREATE, { ...data });
    });

    eventshandler.on(EVENT_LIST.ROOM_REMOVE, (data) => {
      console.log(
        `[LobbyIOManager] Emitting room delete event - roomId: ${data}`,
      );
      this.lobby.emit(EVENT_LIST.ROOM_REMOVE, { roomId: data });
    });

    eventshandler.on(EVENT_LIST.PLAYER_MINUS, (data: RoomId) => {
      console.log(
        `[LobbyIOManager] Emitting player decrease event - roomId: ${data}`,
      );
      this.lobby.emit(EVENT_LIST.PLAYER_MINUS, { roomId: data });
    });

    eventshandler.on(EVENT_LIST.PLAYER_PLUS, (data: RoomId) => {
      console.log(
        `[LobbyIOManager] Emitting player increase event - roomId: ${data}`,
      );
      this.lobby.emit(EVENT_LIST.PLAYER_PLUS, { roomId: data });
    });
  }
}

export default LobbyIOManager;
