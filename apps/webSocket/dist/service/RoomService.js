import { randomUUID } from "node:crypto";
class RoomService {
    roomRegistry;
    gameSessionManager;
    constructor(roomRegistry, gameSessionManager) {
        this.roomRegistry = roomRegistry;
        this.gameSessionManager = gameSessionManager;
    }
    createRoom(userId, nickname) {
        if (!userId || !nickname) {
            throw new Error(`${this.constructor.name} : 정보가 누락되었습니다.`);
        }
        const roomId = randomUUID();
        return this.roomRegistry.createRoom(roomId);
    }
    checkRoom(roomId) {
        return this.roomRegistry.getRoomData(roomId);
    }
    getRoomData(roomId) {
        return this.roomRegistry.getRoomData(roomId);
    }
    removePlayer(roomId, userId) {
        return this.roomRegistry.removePlayer(roomId, userId);
    }
    getRoomList() {
        return this.roomRegistry.getRoomList();
    }
    findOrCreateRoom() {
        return this.roomRegistry.findOrCreateRoom();
    }
    joinPlayer(roomId, userId, nickname, avatar) {
        return this.roomRegistry.joinPlayer(roomId, userId, nickname, avatar);
    }
    readyPlayer(roomId, userId, status) {
        return this.roomRegistry.readyPlayer(roomId, userId, status);
    }
    gameStart(roomId) {
        const result = this.checkRoom(roomId);
        if (result.success && result.message) {
            const room = result.message;
            if (room.isFull()) {
                for (const { isReady } of room.getAllPlayersData()) {
                    if (!isReady) {
                        return { success: false, message: "레디 안함" };
                    }
                }
                const playerIds = room
                    .getAllPlayersData()
                    .map((player) => player.userId);
                return this.gameSessionManager.startGame(roomId, playerIds);
            }
            return { success: false, message: "인원 부족" };
        }
        return { success: true };
    }
    getGameState(roomId) {
        return this.gameSessionManager.getGameState(roomId);
    }
}
export default RoomService;
//# sourceMappingURL=RoomService.js.map