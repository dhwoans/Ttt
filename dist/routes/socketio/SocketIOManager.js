import { Server } from "socket.io";
import Receiver from "../Receiver.js";
import http from "http";
class SocketIOManager {
    socketIO;
    receiver;
    constructor(server, receiver) {
        this.socketIO = new Server(server);
        this.receiver = receiver;
    }
    init() {
        this.setupEventListeners();
        this.startHeartbeat();
    }
    setupEventListeners() { }
    startHeartbeat() { }
    connection() { }
}
export default SocketIOManager;
//# sourceMappingURL=SocketIOManager.js.map