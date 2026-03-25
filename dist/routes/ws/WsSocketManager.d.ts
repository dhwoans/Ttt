import { type WebSocket } from "ws";
import type SocketManager from "../SocketManger.js";
import Receiver from "../Receiver.js";
import SessionManager from "./SessionManager.js";
import http from "http";
/**
 * @deprecated `socket.io` 기반 `SocketIOManager`로 대체됨. 참조하는 곳 없음.
 */
declare class WsSocketManager implements SocketManager {
    receiver: Receiver;
    sessionManger: SessionManager;
    private wss;
    private heartbeatInterval;
    constructor(server: http.Server, receiver: Receiver, sessionManger: SessionManager);
    init(): void;
    setupEventListeners(): void;
    startHeartbeat(): void;
    connection(ws: WebSocket): void;
}
export default WsSocketManager;
//# sourceMappingURL=WsSocketManager.d.ts.map