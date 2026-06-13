class Room {
    players;
    MAX_PLAYERS;
    constructor(max) {
        this.players = new Map();
        this.MAX_PLAYERS = max;
    }
    /**
     * Add player to room and return player info
     */
    addPlayer(userId, nickname, avatar) {
        const playerInfo = {
            nickname: nickname,
            isReady: false,
            ...(avatar && { avatar }),
        };
        this.players.set(userId, playerInfo);
        return playerInfo;
    }
    /**
     * Remove player from room by user ID
     */
    removePlayer(userId) {
        return this.players.delete(userId);
    }
    /**
     * Check if room is at max capacity
     */
    isFull() {
        return this.players.size === this.MAX_PLAYERS;
    }
    /**
     * Get player info by user ID
     */
    getPlayerDate(userId) {
        const player = this.players.get(userId);
        if (!player)
            throw new Error(`Player not found: userId=${userId}`);
        return player;
    }
    /**
     * Get all players in room with user IDs
     */
    getAllPlayersData() {
        return Array.from(this.players.entries()).map(([userId, data]) => ({
            userId,
            ...data,
        }));
    }
    /**
     * Get current player count
     */
    getCurrentPlayer() {
        return this.players.size;
    }
}
export default Room;
//# sourceMappingURL=Room.js.map