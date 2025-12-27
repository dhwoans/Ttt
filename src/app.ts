import Manager from "./service/Manager.js";
import ApiController from "./controller/ApiController.js";
import Receiver from "./routes/Receiver.js";
import Service from "./service/Service.js";
import ApiRoutes from "./routes/ApiRoutes.js";
import type SocketManager from "./routes/SocketManger.js";

import http from "http";
import SocketIOManager from "./routes/socketio/SocketIOManager.js";
import ErrorHandler from "./utils/ErrorHandler.js";
import WSController from "./controller/WSContrller.js";

const manager = new Manager();
const errorHandler = new ErrorHandler();
// const sessionManger = new SessionManger();
const service = new Service(manager);
const apiController = new ApiController(service);
const wsController = new WSController(service);
const receiver = new Receiver(wsController);

const port = 8080;

// api - websocket 포트공유
const api = new ApiRoutes(port, apiController, errorHandler);

const server: http.Server = http.createServer(api.app);
const socket: SocketManager = new SocketIOManager(server, receiver);
socket.init();
server.listen(port, () => {
  console.log(`Server running on port 8080.`);
});
