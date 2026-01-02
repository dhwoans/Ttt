import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import morgan from "morgan";
import type ApiController from "../controller/ApiController.js";
import type UserController from "../controller/UserController.js";

interface GlobalErrorHandler {
  handle(err: Error, req: Request, res: Response, next: NextFunction): void;
}

class ApiRoutes {
  app: Application;
  private port: number;
  private apiController: ApiController;
  private userController: UserController;
  private errorHandler: GlobalErrorHandler;

  constructor(
    port: number,
    apiController: ApiController,
    userController: UserController,
    errorHandler: GlobalErrorHandler
  ) {
    const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : port;

    this.port = envPort;
    this.app = express();
    this.apiController = apiController;
    this.userController = userController;
    this.errorHandler = errorHandler;

    this.app.set("port", this.port);
    this.app.use(morgan("dev"));

    // CORS 설정
    this.app.use(
      cors({
        origin: ["http://localhost:3000", "http://localhost:80"],
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
    /* ========================================================= */
    /* Room */
    /* ========================================================= */
    // 방 생성 (POST)
    this.app.post(
      "/api/room",
      (req: Request, res: Response, next: NextFunction) => {
        this.apiController.createRoom(req, res, next);
      }
    );

    // 방 확인
    this.app.get(
      "/api/room",
      (req: Request, res: Response, next: NextFunction) => {
        this.apiController.checkRoom(req, res, next);
      }
    );

    // 대기실 목록 렌더링
    this.app.get(
      "/api/roomList",
      (req: Request, res: Response, next: NextFunction) => {
        this.apiController.getRoomList(req, res, next);
      }
    );
    /* ========================================================= */
    /* User */
    /* ========================================================= */

    this.app.post(
      "/api/userInfo",
      (req: Request, res: Response, next: NextFunction) => {
        this.apiController.getRoomList(req, res, next);
      }
    );
  }

  /**
   * Express 애플리케이션 인스턴스를 반환
   */
  public getApp(): Application {
    return this.app;
  }
}

export default ApiRoutes;
