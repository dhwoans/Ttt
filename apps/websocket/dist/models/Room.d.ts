import type User from "../dtos/user/User.dto.js";
import type { PlayerInfo } from "../dtos/user/User.dto.js";
declare class Room {
    players: Map<string, User>;
    MAX_PLAYERS: number;
    constructor(max: number);
    /**
     * Add player to room and return player info
     */
    addPlayer(userId: string, nickname: string, avatar?: string): User;
    /**
     * Remove player from room by user ID
     */
    removePlayer(userId: string): boolean;
    /**
     * Check if room is at max capacity
     */
    isFull(): boolean;
    /**
     * Get player info by user ID
     */
    getPlayerDate(userId: string): User;
    /**
     * Get all players in room with user IDs
     */
    getAllPlayersData(): PlayerInfo[];
    /**
     * Get current player count
     */
    getCurrentPlayer(): number;
}
export default Room;
//# sourceMappingURL=Room.d.ts.map