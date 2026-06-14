import type { Server } from "socket.io";
import type { ClientEvents, ServerEvents } from "@ttt/contract";

/**
 * Socket.IO 엔진 레벨 이벤트를 바인딩하는 운영 훅.
 *
 * 비즈니스 로직과 무관한 관찰성(에러/헤더 로그) 책임을 분리한다.
 */
class SocketMonitoringHook {
  /**
   * 엔진 이벤트 리스너를 등록한다.
   */
  bind(io: Server<ClientEvents, ServerEvents>) {
    io.engine.on("connection_error", (err) => {
      console.error("[SocketMonitoringHook] Engine connection error:", err);
    });

    io.engine.on("initial_headers", (_headers, req) => {
      console.log("[SocketMonitoringHook] Initial headers from:", req.url);
    });
  }
}

export default SocketMonitoringHook;


