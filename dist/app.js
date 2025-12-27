import Manager from "./models/Manager.js";
import ApiController from "./controller/ApiController.js";
import Receiver from "./routes/Receiver.js";
import Service from "./service/Service.js";
import ApiRoutes from "./routes/ApiRoutes.js";
import SessionManger from "./routes/ws/SessionManager.js";
import Sender from "./routes/Sender.js";
import http from "http";
import SocketIOManager from "./routes/socketio/SocketIOManager.js";
import ErrorHandler from "./ErrorHandler.js";
import WsSocketManager from "./routes/ws/WsSocketManager.js";
const manager = new Manager();
const errorHandler = new ErrorHandler();
const sessionManger = new SessionManger();
const sender = new Sender(sessionManger);
const service = new Service(manager);
const controller = new ApiController(service, sender);
const receiver = new Receiver(controller);
const port = 8080;
// api - websocket 포트공유
const api = new ApiRoutes(port, controller, errorHandler);
const server = http.createServer(api.app);
const socket = new WsSocketManager(server, receiver, sessionManger);
// const socket: SocketManager = new SocketIOManager(server, receiver);
socket.init();
server.listen(port, () => {
    console.log(`Server running on port 8080.`);
});
//# sourceMappingURL=app.js.map