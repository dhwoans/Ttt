import { Namespace, Server, Socket } from "socket.io";
import Receiver from "../Receiver.js";
import type SocketManager from "../SocketManger.js";
import http from "http";
import LobbyIOManager from "./LobbyIOManager.js";
import RoomIOManager from "./RoomIOManager.js";

class SocketIOManager implements SocketManager {
  io: Server;
  receiver: Receiver;
  lobby: LobbyIOManager;
  room: RoomIOManager;

  constructor(server: http.Server, receiver: Receiver) {
    this.io = new Server(server, { path: "/ws/" });
    this.receiver = receiver;
    this.lobby = new LobbyIOManager(this.io.of("/lobby"));
    this.room = new RoomIOManager(this.io.of("/room"), receiver);
  }

  init() {
    this.setupEventListeners();
    this.sendEvent();
    setInterval(() => {
      console.log(`socket client count:${this.io.engine.clientsCount}`);
    }, 50000);
  }

  setupEventListeners() {
    this.room.setupEventListeners();
    this.lobby.setupEventListeners();
  }

  sendEvent() {
    this.lobby.sendEvent();
    this.room.sendEvent();
  }
}

export default SocketIOManager;
