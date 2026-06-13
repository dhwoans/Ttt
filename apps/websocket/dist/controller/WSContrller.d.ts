import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type RoomService from "../service/RoomService.js";
import type LegacyWsGameService from "../service/legacy/LegacyWsGameService.js";
import type { UserId } from "../type/socket.js";
declare class WSController {
    roomService: RoomService;
    legacyWsGameService: LegacyWsGameService;
    constructor(roomService: RoomService, legacyWsGameService: LegacyWsGameService);
    handleMove(rawMessage: SocketMessage, userId: UserId): void;
    handleJoin(rawMessage: SocketMessage, userId: string): void;
    /**
     * Handle chat message broadcast
     */
    handleChat(rawMessage: SocketMessage): void;
    /**
     * Handle player leave room
     */
    handleLeave(rawMessage: SocketMessage, userId: string): void;
    /**
     * Handle player ready status and game start check
     */
    handleReady(rawMessage: SocketMessage, userId: string): void;
}
export default WSController;
//# sourceMappingURL=WSContrller.d.ts.map