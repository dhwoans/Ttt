import type { ConnId } from "../type/socket.js";
import type User from "../dtos/user/User.dto.js";
import type { PlayerInfo } from "../dtos/user/User.dto.js";
declare class Room {
    players: Map<string, User>;
    MAX_PLAYERS: number;
    constructor(max: number);
    /**
     * Add player to room and return player info
     */
    addPlayer(connId: ConnId, nickname: string, avatar?: string): User;
    /**
     * Remove player from room by connection ID
     */
    removePlayer(connId: ConnId): boolean;
    /**
     * Check if room is at max capacity
     */
    isFull(): boolean;
    /**
     * Get player info by connection ID
     */
    getPlayerDate(connId: string): User;
    /**
     * Get all players in room with connection IDs
     */
    getAllPlayersData(): PlayerInfo[];
    /**
     * Get current player count
     */
    getCurrentPlayer(): number;
}
export default Room;
//# sourceMappingURL=Room.d.ts.map