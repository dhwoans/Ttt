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
    addPlayer(connId, nickname, avatar) {
        const playerInfo = {
            nickname: nickname,
            isReady: false,
            ...(avatar && { avatar }),
        };
        this.players.set(connId, playerInfo);
        return playerInfo;
    }
    /**
     * Remove player from room by connection ID
     */
    removePlayer(connId) {
        return this.players.delete(connId);
    }
    /**
     * Check if room is at max capacity
     */
    isFull() {
        return this.players.size === this.MAX_PLAYERS;
    }
    /**
     * Get player info by connection ID
     */
    getPlayerDate(connId) {
        const player = this.players.get(connId);
        if (!player)
            throw new Error(`Player not found: connId=${connId}`);
        return player;
    }
    /**
     * Get all players in room with connection IDs
     */
    getAllPlayersData() {
        return Array.from(this.players.entries()).map(([connId, data]) => ({
            connId,
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