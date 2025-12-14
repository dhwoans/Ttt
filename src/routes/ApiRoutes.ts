import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import morgan from "morgan";
import type Controller from "../controller/Controller.js";

interface GlobalErrorHandler {
  handle(err: Error, req: Request, res: Response, next: NextFunction): void;
}

class ApiRoutes {
  private port: number;
  private app: Application;
  private controller: Controller;
  private errorHandler: GlobalErrorHandler;

  constructor(
    port: number,
    controller: Controller,
    errorHandler: GlobalErrorHandler
  ) {
    const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : port;

    this.port = envPort;
    this.app = express();
    this.controller = controller;
    this.errorHandler = errorHandler; // errorHandler를 클래스 멤버 변수에 저장

    this.app.set("port", this.port);
    this.app.use(morgan("dev"));

    // CORS 설정
    this.app.use(
      cors({
        origin: ["http://localhost:3000", "http://localhost:4000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );

    this.app.use(express.json());

    this.route();

    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) =>
        this.errorHandler.handle(err, req, res, next)
    );
  }

  private route(): void {
    // 방 생성 (POST)
    this.app.post(
      "/api/room",
      (req: Request, res: Response, next: NextFunction) => {
        this.controller.createRoom(req, res, next);
      }
    );

    // 방 확인
    this.app.get(
      "/api/room",
      (req: Request, res: Response, next: NextFunction) => {
        console.log("신호들어옴");
        this.controller.checkRoom(req, res, next);
      }
    );

    // 대기실 목록 렌더링
    this.app.get(
      "/api/roomList",
      (req: Request, res: Response, next: NextFunction) => {
        this.controller.getRoomList(req, res, next);
      }
    );
  }

  /**
   * Express 애플리케이션 인스턴스를 반환합니다.
   */
  public getApp(): Application {
    return this.app;
  }
}

export default ApiRoutes;
