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
import UserController from "./controller/UserController.js";
import UserService from "./service/UserService.js";
import UserModel from "./models/UserModel.js";
import RedisManager from "./utils/redis.js";

const manager = new Manager();
const errorHandler = new ErrorHandler();
// const sessionManger = new SessionManger();
const redisManger = new RedisManager();

const roomservice = new Service(manager);
const apiController = new ApiController(roomservice, redisManger);

const userModel = new UserModel(redisManger);
const userService = new UserService(userModel);
const userController = new UserController(userService);
const wsController = new WSController(roomservice);
const receiver = new Receiver(wsController);

const port = 8080;

// api - websocket 포트공유
const api = new ApiRoutes(port, apiController, userController, errorHandler);

const server: http.Server = http.createServer(api.app);
console.log("[App] HTTP server created");

const socket: SocketManager = new SocketIOManager(
  server,
  receiver,
  roomservice,
  redisManger,
);
socket.init();
console.log("[App] Socket.IO initialized");

server.listen(port, () => {
  console.log("=".repeat(60));
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📡 HTTP API: http://localhost:${port}`);
  console.log(`🔌 WebSocket: ws://localhost:${port} (path: /socket.io)`);
  console.log("=".repeat(60));
});
