import { Server, Socket } from "socket.io";
import type SocketManager from "../SocketManger.js";
import http from "http";
import type RoomService from "../../service/RoomService.js";
import type RedisManager from "../../utils/redis.js";
import type { ServerEvents, ClientEvents } from "@ttt/contract";
import SocketServerFactory from "./SocketServerFactory.js";
import SocketMonitoringHook from "./SocketMonitoringHook.js";
import SocketMetricsReporter from "./SocketMetricsReporter.js";
import SocketErrorResponder from "./SocketErrorResponder.js";
import TicketAuthService from "../../service/TicketAuthService.js";
import RoomPresenceGateway from "./RoomPresenceGateway.js";
import GameEventPublisher from "./GameEventPublisher.js";
import GameFlowService from "../../service/GameFlowService.js";

/**
 * Socket.IO 라우팅 계층의 조립자(Composition Root).
 *
 * 실제 비즈니스 처리는 분리된 서비스들에 위임하고,
 * 이 클래스는 인스턴스 wiring과 이벤트 연결만 담당한다.
 */
class SocketIOManager implements SocketManager {
  io: Server<ClientEvents, ServerEvents>;
  monitoringHook: SocketMonitoringHook;
  metricsReporter: SocketMetricsReporter;
  errors: SocketErrorResponder;
  authService: TicketAuthService;
  presence: RoomPresenceGateway;
  gameFlow: GameFlowService;
  publisher: GameEventPublisher;

  constructor(
    server: http.Server,
    roomService: RoomService,
    redis: RedisManager,
  ) {
    this.io = SocketServerFactory.create(server);

    this.monitoringHook = new SocketMonitoringHook();
    this.metricsReporter = new SocketMetricsReporter();
    this.errors = new SocketErrorResponder();
    this.authService = new TicketAuthService(redis);
    this.publisher = new GameEventPublisher(this.io);
    this.presence = new RoomPresenceGateway(
      roomService,
      this.errors,
      this.publisher,
    );
    this.gameFlow = new GameFlowService(
      roomService,
      this.errors,
      this.publisher,
    );
  }

  /**
   * 리스너 등록 + outbound 이벤트 브릿지 등록 + 운영 훅 시작.
   */
  init() {
    console.log("[SocketIOManager] Initializing event listeners...");
    this.setupEventListeners();
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

      this.gameFlow.syncReadyTimeoutForSocket(socket, joinResult.roomId);
      this.gameFlow.onRoomStateChanged(joinResult.roomId);

      socket.on("LEAVE", () => {
        console.log(`[SocketIOManager] 🚪 LEAVE event from ${socket.id}`);
        const leaveResult = this.presence.leave(socket, true);
        if (!leaveResult.success) {
          this.errors.emit(socket, leaveResult.message);
          return;
        }

        this.gameFlow.onRoomStateChanged(leaveResult.roomId);
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
        const leaveResult = this.presence.leave(socket, false);
        if (!leaveResult.success) {
          console.log(
            "[SocketIOManager] No room/user data found for disconnecting socket",
          );
          return;
        }

        this.gameFlow.onRoomStateChanged(leaveResult.roomId);
      });

      console.log("=".repeat(60));
    });

    console.log("[SocketIOManager] Root namespace listener registered");
  }
}

export default SocketIOManager;


