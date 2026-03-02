import { Namespace, Server, Socket } from "socket.io";
import Receiver from "../Receiver.js";
import type SocketManager from "../SocketManger.js";
import http from "http";
import LobbyIOManager from "./LobbyIOManager.js";
import RoomIOManager from "./RoomIOManager.js";
import type Service from "../../service/Service.js";

class SocketIOManager implements SocketManager {
  io: Server;
  receiver: Receiver;
  lobby: LobbyIOManager;
  room: RoomIOManager;
  service: Service;

  constructor(server: http.Server, receiver: Receiver, service: Service) {
    console.log("[SocketIOManager] Initializing Socket.IO server...");
    this.io = new Server(server, {
      // Socket.IO 기본 경로 사용
      cors: {
        origin: ["http://localhost:3000", "http://localhost:80"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    console.log(
      "[SocketIOManager] Socket.IO server created with path: /socket.io (default)",
    );
    this.receiver = receiver;
    this.service = service;
    this.lobby = new LobbyIOManager(this.io.of("/lobby"), service);
    this.room = new RoomIOManager(this.io.of("/room"), receiver);
  }

  init() {
    console.log("[SocketIOManager] Initializing event listeners...");
    this.setupEventListeners();
    this.sendEvent();

    // Socket.IO 엔진 이벤트 로그
    this.io.engine.on("connection_error", (err) => {
      console.error("[SocketIOManager] Engine connection error:", err);
    });

    this.io.engine.on("initial_headers", (headers, req) => {
      console.log("[SocketIOManager] Initial headers from:", req.url);
    });

    console.log(
      "[SocketIOManager] Socket.IO is ready and listening for connections",
    );

    setInterval(() => {
      console.log(
        `[SocketIOManager] Active connections: ${this.io.engine.clientsCount}`,
      );
    }, 50000);
  }

  setupEventListeners() {
    console.log("[SocketIOManager] Setting up root namespace listener...");

    // 루트 네임스페이스 연결 처리 (클라이언트가 ws://localhost:8080/ws/ 로 연결)
    this.io.on("connection", (socket: Socket) => {
      console.log("=".repeat(60));
      console.log(`[SocketIOManager] 🔌 NEW CONNECTION DETECTED!`);
      console.log(`[SocketIOManager] Socket ID: ${socket.id}`);
      console.log(`[SocketIOManager] Transport: ${socket.conn.transport.name}`);

      const userId = socket.handshake.auth?.userId;
      const ticket = socket.handshake.auth?.ticket;

      console.log("[SocketIOManager] Auth data:", { userId, ticket });

      // 클라이언트에 연결 성공 알림
      socket.emit("CONNECTED", {
        success: true,
        socketId: socket.id,
        message: "Socket connection established",
      });
      console.log(`[SocketIOManager] ✅ CONNECTED event sent to client`);

      if (!userId) {
        console.error("[SocketIOManager] ❌ No userId, disconnecting");
        socket.emit("ERROR", { message: "userId is required" });
        socket.disconnect();
        return;
      }

      // TODO: 티켓 검증 (Redis)

      // 방 찾기 또는 생성
      console.log("[SocketIOManager] Finding or creating room...");
      const result = this.service.findOrCreateRoom();

      if (result.success && result.message) {
        const roomId = result.message;
        console.log(
          `[SocketIOManager] ✅ Room assigned: ${roomId} to user: ${userId}`,
        );
        socket.emit("ROOM_ASSIGNED", { roomId });
      } else {
        console.error("[SocketIOManager] ❌ Failed to assign room");
        socket.emit("ERROR", { message: "Failed to assign room" });
        socket.disconnect();
      }

      socket.on("disconnect", (reason) => {
        console.log(
          `[SocketIOManager] 🔌 Disconnect: ${socket.id}, reason: ${reason}`,
        );
      });
      console.log("=".repeat(60));
    });

    console.log("[SocketIOManager] Root namespace listener registered");
    this.room.setupEventListeners();
    this.lobby.setupEventListeners();
    console.log("[SocketIOManager] All namespace listeners registered");
  }

  sendEvent() {
    this.lobby.sendEvent();
    this.room.sendEvent();
  }
}

export default SocketIOManager;
