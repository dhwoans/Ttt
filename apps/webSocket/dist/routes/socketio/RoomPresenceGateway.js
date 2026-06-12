import SocketErrorResponder from "./SocketErrorResponder.js";
import GameEventPublisher from "./GameEventPublisher.js";
/**
 * 방 입장/퇴장/연결종료와 같은 흐름을 담당하는 게이트웨이.
 *
 * 매칭 후 입장 동기화, 퇴장 처리, 소켓 세션 데이터 정리.
 */
class RoomPresenceGateway {
    roomService;
    errors;
    publisher;
    constructor(roomService, errors, publisher) {
        this.roomService = roomService;
        this.errors = errors;
        this.publisher = publisher;
    }
    /**
     * 유저를 방에 배정하고 조인 처리한 뒤, 입장 관련 이벤트를 전송한다.
     */
    assignAndJoin(socket, user) {
        const result = this.roomService.findOrCreateRoom();
        if (!result.success || !result.message) {
            return { success: false, message: "Failed to assign room" };
        }
        const roomId = result.message;
        const roomData = this.roomService.getRoomData(roomId);
        const existingPlayers = roomData.success && roomData.message
            ? roomData.message.getAllPlayersData()
            : [];
        const joinResult = this.roomService.joinPlayer(roomId, user.userId, user.nickname, user.avatar);
        if (!joinResult.success) {
            return { success: false, message: "Failed to join room" };
        }
        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.userId = user.userId;
        socket.data.nickname = user.nickname;
        socket.data.avatar = user.avatar;
        if (existingPlayers.length > 0) {
            this.publisher.emitPlayerJoined(socket, roomId, {
                userId: user.userId,
                nickname: user.nickname,
                isReady: false,
                ...(user.avatar ? { avatar: user.avatar } : {}),
            });
        }
        this.publisher.emitExistingPlayers(socket, roomId, existingPlayers);
        this.publisher.emitRoomAssigned(socket, roomId);
        return { success: true, roomId };
    }
    /**
     * 공통 퇴장 처리 로직.
     * `LEAVE` 이벤트와 `disconnect`에서 재사용한다.
     */
    leave(socket, withSuccessResponse = false) {
        const roomId = socket.data.roomId;
        const userId = socket.data.userId;
        const nickname = socket.data.nickname;
        const avatar = socket.data.avatar;
        if (!roomId || !userId) {
            return { success: false, message: "Not in a room" };
        }
        const removeResult = this.roomService.removePlayer(roomId, userId);
        if (!removeResult.success) {
            return { success: false, message: "Failed to leave room" };
        }
        this.publisher.emitPlayerLeft(socket, roomId, {
            userId,
            ...(nickname ? { nickname } : {}),
            ...(avatar ? { avatar } : {}),
        });
        socket.leave(roomId);
        delete socket.data.roomId;
        delete socket.data.userId;
        delete socket.data.nickname;
        delete socket.data.avatar;
        if (withSuccessResponse) {
            this.publisher.emitLeaveSuccess(socket);
        }
        return { success: true, roomId };
    }
    /** 클라이언트 명시적 LEAVE 요청 처리 진입점. */
    handleLeaveEvent(socket) {
        const result = this.leave(socket, true);
        if (!result.success) {
            this.errors.emit(socket, result.message);
        }
    }
    /** 소켓 연결 종료 시 정리 처리 진입점. */
    handleDisconnect(socket) {
        const result = this.leave(socket, false);
        if (!result.success) {
            console.log("[RoomPresenceGateway] No room/user data found on disconnect");
        }
    }
}
export default RoomPresenceGateway;
//# sourceMappingURL=RoomPresenceGateway.js.map