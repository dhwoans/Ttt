import type RoomService from "../RoomService.js";
import type GameSessionManager from "../GameSessionManager.js";
import type SocketMessage from "../../dtos/SocketMessage.dto.js";
import type { SuccessResponse } from "../../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../../dtos/FailureResponse.dto.js";
import type { UserId } from "../../type/socket.js";
declare class LegacyWsGameService {
    private readonly gameSessionManager;
    private readonly roomService;
    constructor(gameSessionManager: GameSessionManager, roomService: RoomService);
    processMove(rawMessage: SocketMessage, userId: UserId): SuccessResponse<void> | FailureResponse;
    private broadcastMove;
    private broadcastNextGameState;
    private resetReady;
}
export default LegacyWsGameService;
//# sourceMappingURL=LegacyWsGameService.d.ts.map