import { Server } from "socket.io";
import type SocketManager from "../SocketManger.js";
import http from "http";
import type RoomService from "../../service/RoomService.js";
import type RedisManager from "../../utils/redis.js";
import type { ServerEvents, ClientEvents } from "@ttt/contract";
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
declare class SocketIOManager implements SocketManager {
    io: Server<ClientEvents, ServerEvents>;
    monitoringHook: SocketMonitoringHook;
    metricsReporter: SocketMetricsReporter;
    errors: SocketErrorResponder;
    authService: TicketAuthService;
    presence: RoomPresenceGateway;
    gameFlow: GameFlowService;
    publisher: GameEventPublisher;
    constructor(server: http.Server, roomService: RoomService, redis: RedisManager);
    /**
     * 리스너 등록 + outbound 이벤트 브릿지 등록 + 운영 훅 시작.
     */
    init(): void;
    /**
     * 루트 네임스페이스의 inbound 이벤트를 각 책임 클래스에 위임한다.
     */
    setupEventListeners(): void;
}
export default SocketIOManager;
//# sourceMappingURL=SocketIOManager.d.ts.map