import { Server } from "socket.io";
import type http from "http";
import type { ClientEvents, ServerEvents } from "@ttt/contract";
/**
 * Socket.IO 서버 인스턴스 생성 전용 팩토리.
 *
 * 서버 생성/옵션(CORS) 책임을 `SocketIOManager`에서 분리해
 * 초기화 책임을 단일 지점으로 모은다.
 */
declare class SocketServerFactory {
    /**
     * HTTP 서버를 기반으로 Socket.IO 서버를 생성한다.
     */
    static create(server: http.Server): Server<ClientEvents, ServerEvents>;
}
export default SocketServerFactory;
//# sourceMappingURL=SocketServerFactory.d.ts.map