import type RoomRegistry from "./RoomRegistry.js";
import type GameSessionManager from "./GameSessionManager.js";
import type Room from "../models/Room.js";
import type Ttt from "../game/GameState.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type { Nickname, RoomId, UserId } from "../type/socket.js";
declare class RoomService {
    private readonly roomRegistry;
    private readonly gameSessionManager;
    constructor(roomRegistry: RoomRegistry, gameSessionManager: GameSessionManager);
    createRoom(userId: UserId, nickname: Nickname): SuccessResponse<RoomId> | FailureResponse;
    checkRoom(roomId: RoomId): SuccessResponse<Room> | FailureResponse;
    getRoomData(roomId: RoomId): SuccessResponse<Room> | FailureResponse;
    removePlayer(roomId: RoomId, userId: string): SuccessResponse<string> | FailureResponse;
    getRoomList(): Array<object>;
    findOrCreateRoom(): SuccessResponse<RoomId> | FailureResponse;
    joinPlayer(roomId: RoomId, userId: string, nickname: Nickname, avatar?: string): SuccessResponse<RoomId> | FailureResponse;
    readyPlayer(roomId: RoomId, userId: string, status: boolean): SuccessResponse<void> | FailureResponse;
    gameStart(roomId: RoomId): SuccessResponse<void> | FailureResponse;
    getGameState(roomId: RoomId): SuccessResponse<Ttt> | FailureResponse;
}
export default RoomService;
//# sourceMappingURL=RoomService.d.ts.map