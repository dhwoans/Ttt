import { Server, Socket } from "socket.io";
import Receiver from "../Receiver.js";
import type SocketManager from "../SocketManger.js";
import http from "http";
import LobbyIOManager from "./LobbyIOManager.js";
import RoomIOManager from "./RoomIOManager.js";
import type Service from "../../service/Service.js";
import type RedisManager from "../../utils/redis.js";
import type { ServerEvents, ClientEvents } from "@share";
import SocketServerFactory from "./SocketServerFactory.js";
import SocketMonitoringHook from "./SocketMonitoringHook.js";
import SocketMetricsReporter from "./SocketMetricsReporter.js";
import SocketErrorResponder from "./SocketErrorResponder.js";
import TicketAuthService from "./TicketAuthService.js";
import RoomPresenceGateway from "./RoomPresenceGateway.js";
import GameEventPublisher from "./GameEventPublisher.js";
import GameFlowService from "./GameFlowService.js";

/**
 * Socket.IO 라우팅 계층의 조립자(Composition Root).
 *
 * 실제 비즈니스 처리는 분리된 서비스들에 위임하고,
 * 이 클래스는 인스턴스 wiring과 이벤트 연결만 담당한다.
 */
class SocketIOManager implements SocketManager {
  io: Server<ClientEvents, ServerEvents>;
  lobby: LobbyIOManager;
  room: RoomIOManager;
  monitoringHook: SocketMonitoringHook;
  metricsReporter: SocketMetricsReporter;
  errors: SocketErrorResponder;
  authService: TicketAuthService;
  presence: RoomPresenceGateway;
  gameFlow: GameFlowService;
  publisher: GameEventPublisher;

  constructor(
    server: http.Server,
    receiver: Receiver,
    service: Service,
    redis: RedisManager,
  ) {
    this.io = SocketServerFactory.create(server);
    this.lobby = new LobbyIOManager(this.io.of("/lobby"), service);
    this.room = new RoomIOManager(this.io.of("/room"), receiver);

    this.monitoringHook = new SocketMonitoringHook();
    this.metricsReporter = new SocketMetricsReporter();
    this.errors = new SocketErrorResponder();
    this.authService = new TicketAuthService(redis);
    this.publisher = new GameEventPublisher(this.io);
    this.presence = new RoomPresenceGateway(
      service,
      this.errors,
      this.publisher,
    );
    this.gameFlow = new GameFlowService(service, this.errors, this.publisher);
  }

  /**
   * 리스너 등록 + outbound 이벤트 브릿지 등록 + 운영 훅 시작.
   */
  init() {
    console.log("[SocketIOManager] Initializing event listeners...");
    this.setupEventListeners();
    this.sendEvent();
    this.monitoringHook.bind(this.io);

    console.log(
      "[SocketIOManager] Socket.IO is ready and listening for connections",
    );
    this.metricsReporter.start(this.io);
  }

  /**
   * 루트 네임스페이스의 inbound 이벤트를 각 책임 클래스에 위임한다.
   */
  setupEventListeners() {
    console.log("[SocketIOManager] Setting up root namespace listener...");

    this.io.on("connection", async (socket: Socket) => {
      console.log("=".repeat(60));
      console.log(`[SocketIOManager] 🔌 NEW CONNECTION DETECTED!`);
      console.log(`[SocketIOManager] Socket ID: ${socket.id}`);
      console.log(`[SocketIOManager] Transport: ${socket.conn.transport.name}`);

      const ticket = socket.handshake.auth?.ticket;
      this.publisher.emitConnected(socket);

      if (!ticket) {
        console.error("[SocketIOManager] ❌ No ticket, disconnecting");
        this.errors.emitAndDisconnect(socket, "ticket is required");
        return;
      }

      const authResult = await this.authService.validateAndConsume(ticket);

      if (!authResult.success) {
        this.errors.emitAndDisconnect(socket, authResult.message);
        return;
      }

      const joinResult = this.presence.assignAndJoin(socket, authResult.user);
      if (!joinResult.success) {
        this.errors.emitAndDisconnect(socket, joinResult.message);
        return;
      }

      socket.on("LEAVE", () => {
        console.log(`[SocketIOManager] 🚪 LEAVE event from ${socket.id}`);
        this.presence.handleLeaveEvent(socket);
      });

      socket.on("READY", (data: { isReady: boolean }) => {
        console.log(
          `[SocketIOManager] ✅ READY event from ${socket.id}:`,
          data,
        );
        this.gameFlow.handleReady(socket, data);
      });

      socket.on("MOVE", (data: { move: number }) => {
        console.log(`[SocketIOManager] 🎯 MOVE event from ${socket.id}:`, data);
        this.gameFlow.handleMove(socket, data);
      });

      socket.on("disconnect", (reason) => {
        console.log(
          `[SocketIOManager] 🔌 Disconnect: ${socket.id}, reason: ${reason}`,
        );
        this.presence.handleDisconnect(socket);
      });

      console.log("=".repeat(60));
    });

    console.log("[SocketIOManager] Root namespace listener registered");
    this.room.setupEventListeners();
    this.lobby.setupEventListeners();
    console.log("[SocketIOManager] All namespace listeners registered");
  }

  /**
   * 기존 eventhandler 기반 네임스페이스 송신 훅을 활성화한다.
   */
  sendEvent() {
    this.lobby.sendEvent();
    this.room.sendEvent();
  }
}

export default SocketIOManager;
