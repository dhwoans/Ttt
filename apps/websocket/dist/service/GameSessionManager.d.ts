import Ttt from "../game/GameState.js";
import type Action from "../dtos/Action.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type { RoomId, UserId } from "../type/socket.js";
declare class GameSessionManager {
    private readonly games;
    getGameState(roomId: RoomId): SuccessResponse<Ttt> | FailureResponse;
    startGame(roomId: RoomId, playerIds: UserId[]): SuccessResponse | FailureResponse;
    deleteGame(roomId: RoomId): SuccessResponse | FailureResponse;
    applyMove(roomId: RoomId, action: Action): SuccessResponse | FailureResponse;
}
export default GameSessionManager;
//# sourceMappingURL=GameSessionManager.d.ts.map