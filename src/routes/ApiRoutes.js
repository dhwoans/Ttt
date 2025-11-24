import express from "express";
import cors from "cors";
import morgan from "morgan"

class ApiRoutes {
  constructor(port, controller, errorHandler) {
    this.port = process.env.PORT || port;
    this.app = express();
    this.controller = controller;
    this.app.set("port", this.port);
    this.app.use(morgan("dev"));
    this.app.use(
      cors({
        origin: ["http://localhost:3000", "http://localhost:4000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );
    this.app.use(express.json());

    this.#route();

    this.app.use((err, req, res, next) =>
      errorHandler.handle(err, req, res, next)
    );
  }

  #route() {
    this.app.post("/api/room", (req, res, next) => {
      this.controller.createRoom(req, res, next);
    });
    this.app.get("/api/room", (req, res, next) => {
      this.controller.checkRoom(req, res, next);
    });
    this.app.get("/api/roomList", (req, res, next) => {
      this.controller.getRoomList(req, res, next);
    });
  }
}
export default ApiRoutes;
