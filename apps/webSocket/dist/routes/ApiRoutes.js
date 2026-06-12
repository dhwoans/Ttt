import express, {} from "express";
import cors from "cors";
import morgan from "morgan";
class ApiRoutes {
    app;
    port;
    apiController;
    userController;
    errorHandler;
    constructor(port, apiController, userController, errorHandler) {
        const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : port;
        this.port = envPort;
        this.app = express();
        this.apiController = apiController;
        this.userController = userController;
        this.errorHandler = errorHandler;
        this.app.set("port", this.port);
        this.app.use(morgan("dev"));
        // CORS 설정
        this.app.use(cors({
            origin: ["http://localhost:3000", "http://localhost:80"],
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        }));
        this.app.use(express.json());
        this.route();
        this.app.use((err, req, res, next) => this.errorHandler.handle(err, req, res, next));
    }
    route() {
        /* ========================================================= */
        /* Room */
        /* ========================================================= */
        // 방 생성 (POST)
        this.app.post("/api/room", (req, res, next) => {
            this.apiController.createRoom(req, res, next);
        });
        // 방 확인
        this.app.get("/api/room", (req, res, next) => {
            this.apiController.checkRoom(req, res, next);
        });
        // 대기실 목록 렌더링
        this.app.get("/api/roomList", (req, res, next) => {
            this.apiController.getRoomList(req, res, next);
        });
        /* ========================================================= */
        /* User */
        /* ========================================================= */
        // 사용자 생성 (POST)
        this.app.post("/api/user", (req, res, next) => {
            this.userController.createUser(req, res, next);
        });
        /* ========================================================= */
        /* Ticket */
        /* ========================================================= */
        // 티켓 발급 (POST)
        this.app.post("/api/ticket", (req, res, next) => {
            this.apiController.issueTicket(req, res, next);
        });
    }
    /**
     * Express 애플리케이션 인스턴스를 반환
     */
    getApp() {
        return this.app;
    }
}
export default ApiRoutes;
//# sourceMappingURL=ApiRoutes.js.map