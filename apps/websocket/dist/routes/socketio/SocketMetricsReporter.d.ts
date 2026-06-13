import type { Server } from "socket.io";
import type { ClientEvents, ServerEvents } from "@ttt/contract";
/**
 * Socket 연결 수 메트릭을 주기적으로 출력하는 리포터.
 */
declare class SocketMetricsReporter {
    /**
     * 기본 50초 간격으로 활성 연결 수를 로깅한다.
     */
    start(io: Server<ClientEvents, ServerEvents>, intervalMs?: number): void;
}
export default SocketMetricsReporter;
//# sourceMappingURL=SocketMetricsReporter.d.ts.map