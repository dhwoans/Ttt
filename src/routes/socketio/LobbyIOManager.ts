import { Namespace, Server, Socket } from "socket.io";
import { eventshandler, EVENT_LIST } from "../../utils/eventhandler.js";
import type { RoomId, roomInfo } from "../../type/socket.js";

class LobbyIOManager {
  lobby: Namespace;
  session: Map<string, string>;

  constructor(lobby: Namespace) {
    this.lobby = lobby;
    this.session = new Map();
  }
  setupEventListeners() {
    this.lobby.on("connection", (socket: Socket) => {
      console.log(
        `[LobbyIOManager] Connection established - socketId: ${socket.id}`
      );
      this.connection(socket);
    });
  }

  connection(socket: Socket) {
    socket.on("disconnect", (reason: string) => {
      console.log(
        `[LobbyIOManager] Disconnect - socketId: ${socket.id}, reason: ${reason}`
      );
      this.session.delete(socket.id);
    });

    socket.on("joinLobby", (data) => {
      console.log(
        `[LobbyIOManager] joinLobby received from socketId: ${
          socket.id
        }, data: ${JSON.stringify(data)}`
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
        `[LobbyIOManager] Emitting room delete event - roomId: ${data}`
      );
      this.lobby.emit(EVENT_LIST.ROOM_REMOVE, { roomId: data });
    });

    eventshandler.on(EVENT_LIST.PLAYER_MINUS, (data: RoomId) => {
      console.log(
        `[LobbyIOManager] Emitting player decrease event - roomId: ${data}`
      );
      this.lobby.emit(EVENT_LIST.PLAYER_MINUS, { roomId: data });
    });

    eventshandler.on(EVENT_LIST.PLAYER_PLUS, (data: RoomId) => {
      console.log(
        `[LobbyIOManager] Emitting player increase event - roomId: ${data}`
      );
      this.lobby.emit(EVENT_LIST.PLAYER_PLUS, { roomId: data });
    });
  }
}

export default LobbyIOManager;
