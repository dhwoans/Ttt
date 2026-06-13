import { Server } from "socket.io";
/**
 * Socket.IO 서버 인스턴스 생성 전용 팩토리.
 *
 * 서버 생성/옵션(CORS) 책임을 `SocketIOManager`에서 분리해
 * 초기화 책임을 단일 지점으로 모은다.
 */
class SocketServerFactory {
    /**
     * HTTP 서버를 기반으로 Socket.IO 서버를 생성한다.
     */
    static create(server) {
        console.log("[SocketServerFactory] Initializing Socket.IO server...");
        const io = new Server(server, {
            cors: {
                origin: ["http://localhost:3000", "http://localhost:80"],
                methods: ["GET", "POST"],
                credentials: true,
            },
        });
        console.log("[SocketServerFactory] Socket.IO server created with path: /socket.io (default)");
        return io;
    }
}
export default SocketServerFactory;
//# sourceMappingURL=SocketServerFactory.js.map