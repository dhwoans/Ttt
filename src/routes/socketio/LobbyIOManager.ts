import { Namespace, Server, Socket } from "socket.io";
import { eventshandler, EVENT_LIST } from "../../utils/eventhandler.js";
import type { RoomId, roomInfo } from "../../../type/socket.d.js";

class LobbyIOManager {
  lobby: Namespace;
  session: Map<string, string>;

  constructor(lobby: Namespace) {
    this.lobby = lobby;
    this.session = new Map();
  }
  setupEventListeners() {
    this.lobby.on("connection", (socket: Socket) => {
      console.log(`[LOBBY] 연결 성공! socketId: ${socket.id}`);
      this.connection(socket);
    });
  }

  connection(socket: Socket) {
    socket.on("disconnect", (reason: string) => {
      console.log(`[LOBBY] 클라이언트 ${socket.id} 연결해제 ${reason}`);
      this.session.delete(socket.id);
    });

    socket.on("joinLobby", (data) => {
      console.log(
        `[LOBBY] 클라이언트 ${socket.id}로부터 'joinLobby' 수신. data: ${JSON.stringify(data)}`
      );
      this.lobby.to(socket.id).emit("joinLobby", { status: "success" });
    });
  }

  sendEvent() {
    eventshandler.on(EVENT_LIST.ROOM_CREATE, (data: roomInfo) => {
      console.log(`[${this.constructor.name}] 방생성 요청`);
      this.lobby.emit(EVENT_LIST.ROOM_CREATE, { ...data });
    });

    eventshandler.on(EVENT_LIST.ROOM_REMOVE, (data) => {
      console.log(`[${this.constructor.name}] 방삭제 요청. roomId: ${data}`);
      this.lobby.emit(EVENT_LIST.ROOM_REMOVE, { roomId: data });
    });

    eventshandler.on(EVENT_LIST.PLAYER_MINUS, (data: RoomId) => {
      console.log(`[${this.constructor.name}] 인원 감소. roomId: ${data}`);
      this.lobby.emit(EVENT_LIST.PLAYER_MINUS, { roomId: data });
    });

    eventshandler.on(EVENT_LIST.PLAYER_PLUS, (data: RoomId) => {
      console.log(`[${this.constructor.name}] 인원 증가. roomId: ${data}`);
      this.lobby.emit(EVENT_LIST.PLAYER_PLUS, { roomId: data });
    });
  }
}

export default LobbyIOManager;
