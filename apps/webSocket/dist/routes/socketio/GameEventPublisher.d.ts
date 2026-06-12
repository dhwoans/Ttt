import type { Server, Socket } from "socket.io";
import type { ClientEvents, ServerEvents } from "@ttt/contract";
type PlayerPayload = {
    userId: string;
    nickname: string;
    isReady: boolean;
    avatar?: string;
};
/**
 * Socket 이벤트 송신 전담 클래스.
 *
 * payload 포맷을 한 곳에서 관리하여
 * 전송 규격을 일관되게 유지한다.
 */
declare class GameEventPublisher {
    private readonly io;
    constructor(io: Server<ClientEvents, ServerEvents>);
    /** 연결 직후 클라이언트에 연결 성공 이벤트를 전달한다. */
    emitConnected(socket: Socket): void;
    emitRoomAssigned(socket: Socket, roomId: string): void;
    /** 새로 입장한 플레이어에게 현재 방의 기존 플레이어 목록을 전달한다. */
    emitExistingPlayers(socket: Socket, roomId: string, players: PlayerPayload[]): void;
    emitPlayerJoined(socket: Socket, roomId: string, player: PlayerPayload): void;
    emitPlayerLeft(socket: Socket, roomId: string, payload: {
        userId: string;
        nickname?: string;
        avatar?: string;
    }): void;
    emitLeaveSuccess(socket: Socket): void;
    /** 방 전체에 플레이어 READY 상태 변화를 브로드캐스트한다. */
    emitPlayerReady(roomId: string, payload: {
        userId: string;
        nickname: string;
        avatar?: string;
        isReady: boolean;
    }): void;
    /** 게임 시작 후 PLAYING 상태 정보를 방 전체에 전송한다. */
    emitPlaying(roomId: string, payload: {
        status: "PLAYING";
        currentTurnPlayerId: string;
        players: string[];
    }): void;
    /** 유효한 MOVE 적용 결과를 방 전체에 전파한다. */
    emitMoveMade(roomId: string, payload: {
        userId: string;
        move: number;
        isAuto?: boolean;
    }): void;
    emitTurnTimeoutStarted(roomId: string, payload: {
        timeoutMs: number;
        currentTurnPlayerId: string;
    }): void;
    /** 다음 턴 플레이어 정보를 방 전체에 전송한다. */
    emitNextTurn(roomId: string, payload: {
        currentTurn: number;
        nextPlayerId: string;
    }): void;
    /** 게임 종료 결과를 방 전체에 전송한다. */
    emitGameOver(roomId: string, payload: {
        result: "win" | "draw";
        winner: string | null;
        winnerIndex: number;
        board: string[];
    }): void;
    /** 방 범위 에러를 공통 포맷으로 전송한다. */
    emitRoomError(roomId: string, message: string): void;
    emitReadyTimeoutStarted(roomId: string, timeoutMs: number): void;
    emitReadyTimeoutStartedToSocket(socket: Socket, roomId: string, timeoutMs: number): void;
    emitReadyTimeoutExpired(roomId: string, userId: string, message: string): void;
    emitReadyTimeoutCanceled(roomId: string, reason: "ROOM_NOT_FULL" | "ALL_READY" | "ROOM_UNAVAILABLE"): void;
    evictPlayerFromRoom(roomId: string, userId: string, reason: string): Promise<void>;
}
export type { PlayerPayload };
export default GameEventPublisher;
//# sourceMappingURL=GameEventPublisher.d.ts.map