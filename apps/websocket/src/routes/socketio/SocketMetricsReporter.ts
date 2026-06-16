import type { Server } from "socket.io";
import type { ClientEvents, ServerEvents } from "@ttt/contract";

/**
 * Socket 연결 수 메트릭을 주기적으로 출력하는 리포터.
 */
class SocketMetricsReporter {
  /**
   * 기본 50초 간격으로 활성 연결 수를 로깅한다.
   */
  start(io: Server<ClientEvents, ServerEvents>, intervalMs = 50000) {
    setInterval(() => {
      console.log(
        `[SocketMetricsReporter] Active connections: ${io.engine.clientsCount}`,
      );
    }, intervalMs);
  }
}

export default SocketMetricsReporter;
