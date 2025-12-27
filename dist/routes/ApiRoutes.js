import express, {} from "express";
import cors from "cors";
import morgan from "morgan";
class ApiRoutes {
    app;
    port;
    controller;
    errorHandler;
    constructor(port, controller, errorHandler) {
        const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : port;
        this.port = envPort;
        this.app = express();
        this.controller = controller;
        this.errorHandler = errorHandler; // errorHandler를 클래스 멤버 변수에 저장
        this.app.set("port", this.port);
        this.app.use(morgan("dev"));
        // CORS 설정
        this.app.use(cors({
            origin: ["http://localhost:3000", "http://localhost:4000"],
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        }));
        this.app.use(express.json());
        this.route();
        this.app.use((err, req, res, next) => this.errorHandler.handle(err, req, res, next));
    }
    route() {
        // 방 생성 (POST)
        this.app.post("/api/room", (req, res, next) => {
            this.controller.createRoom(req, res, next);
        });
        // 방 확인
        this.app.get("/api/room", (req, res, next) => {
            console.log("신호들어옴");
            this.controller.checkRoom(req, res, next);
        });
        // 대기실 목록 렌더링
        this.app.get("/api/roomList", (req, res, next) => {
            this.controller.getRoomList(req, res, next);
        });
    }
    /**
     * Express 애플리케이션 인스턴스를 반환합니다.
     */
    getApp() {
        return this.app;
    }
}
export default ApiRoutes;
//# sourceMappingURL=ApiRoutes.js.map