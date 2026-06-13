import type { Socket } from "socket.io";
import type RoomService from "./RoomService.js";
import SocketErrorResponder from "../routes/socketio/SocketErrorResponder.js";
import GameEventPublisher from "../routes/socketio/GameEventPublisher.js";
/**
 * 게임 진행 흐름(READY, MOVE, 상태 전이)을 오케스트레이션하는 서비스.
 *
 * 도메인 처리 결과를 받아 적절한 송신 이벤트를 발행하며,
 * Socket 핸들러가 비즈니스 규칙을 직접 가지지 않도록 분리한다.
 */
declare class GameFlowService {
    private readonly roomService;
    private readonly errors;
    private readonly publisher;
    private readonly readyTimeoutMs;
    private readonly readyTimeouts;
    private readonly readyTimeoutExpiresAt;
    private readonly turnTimeoutMs;
    private readonly turnTimeouts;
    private readonly turnTimeoutExpiresAt;
    private readonly turnTimeoutTokens;
    constructor(roomService: RoomService, errors: SocketErrorResponder, publisher: GameEventPublisher);
    onRoomStateChanged(roomId: string): void;
    syncReadyTimeoutForSocket(socket: Socket, roomId: string): void;
    /**
     * READY 변경 처리:
     * - 플레이어 ready 상태 반영
     * - 전원 ready + 정원 충족 시 게임 시작
     * - 게임 시작 후 ready 초기화 및 PLAYING 전송
     */
    handleReady(socket: Socket, data: {
        isReady: boolean;
    }): void;
    /**
     * MOVE 처리:
     * - 입력 검증
     * - 액션 적용
     * - MOVE/NEXT_TURN/GAME_OVER 이벤트 전송
     */
    handleMove(socket: Socket, data: {
        move: number;
    }): void;
    private startTurnTimeout;
    private clearTurnTimeout;
    private handleTurnTimeout;
    private startReadyTimeout;
    private clearReadyTimeout;
    private handleReadyTimeout;
}
export default GameFlowService;
//# sourceMappingURL=GameFlowService.d.ts.map