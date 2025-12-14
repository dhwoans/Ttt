import SocketManager from "./src/routes/SocketManager.js";
import Manager from "./src/models/Manager.js";
import ApiController from "./src/controller/ApiController.js";
import Receiver from "./src/routes/Receiver.js";
import Service from "./src/service/Service.js";
import ErrorHandler from "./src/ErrorHandler.js";
import ApiRoutes from "./src/routes/ApiRoutes.js";
import SessionManger from "./src/routes/SessionManager.js";
import Sender from "./src/routes/Sender.js";

import http from "http";

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
new SocketManager(server, receiver, sessionManger);

server.listen(8080, () => {
  console.log(`Server running on port 8080.`);
});
