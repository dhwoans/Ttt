import { Server } from "socket.io";
import Receiver from "../Receiver.js";
import type SocketManager from "../SocketManger.js";
import http from "http";
declare class SocketIOManager implements SocketManager {
    socketIO: Server;
    receiver: Receiver;
    constructor(server: http.Server, receiver: Receiver);
    init(): void;
    setupEventListeners(): void;
    startHeartbeat(): void;
    connection(): void;
}
export default SocketIOManager;
//# sourceMappingURL=SocketIOManager.d.ts.map