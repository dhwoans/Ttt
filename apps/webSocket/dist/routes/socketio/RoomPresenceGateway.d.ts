import type { Socket } from "socket.io";
import type RoomService from "../../service/RoomService.js";
import SocketErrorResponder from "./SocketErrorResponder.js";
import GameEventPublisher from "./GameEventPublisher.js";
type AuthenticatedUser = {
    userId: string;
    nickname: string;
    avatar?: string;
};
type JoinResult = {
    success: true;
    roomId: string;
} | {
    success: false;
    message: string;
};
/**
 * 방 입장/퇴장/연결종료와 같은 흐름을 담당하는 게이트웨이.
 *
 * 매칭 후 입장 동기화, 퇴장 처리, 소켓 세션 데이터 정리.
 */
declare class RoomPresenceGateway {
    private readonly roomService;
    private readonly errors;
    private readonly publisher;
    constructor(roomService: RoomService, errors: SocketErrorResponder, publisher: GameEventPublisher);
    /**
     * 유저를 방에 배정하고 조인 처리한 뒤, 입장 관련 이벤트를 전송한다.
     */
    assignAndJoin(socket: Socket, user: AuthenticatedUser): JoinResult;
    /**
     * 공통 퇴장 처리 로직.
     * `LEAVE` 이벤트와 `disconnect`에서 재사용한다.
     */
    leave(socket: Socket, withSuccessResponse?: boolean): JoinResult;
    /** 클라이언트 명시적 LEAVE 요청 처리 진입점. */
    handleLeaveEvent(socket: Socket): void;
    /** 소켓 연결 종료 시 정리 처리 진입점. */
    handleDisconnect(socket: Socket): void;
}
export type { AuthenticatedUser, JoinResult };
export default RoomPresenceGateway;
//# sourceMappingURL=RoomPresenceGateway.d.ts.map