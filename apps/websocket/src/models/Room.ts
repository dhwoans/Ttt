import type User from "../dtos/user/User.dto.js";
import type { PlayerInfo } from "../dtos/user/User.dto.js";

class Room {
  players: Map<string, User>;
  MAX_PLAYERS: number;

  constructor(max: number) {
    this.players = new Map();
    this.MAX_PLAYERS = max;
  }

  /**
   * Add player to room and return player info
   */
  addPlayer(userId: string, nickname: string, avatar?: string): User {
    const playerInfo: User = {
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
  removePlayer(userId: string): boolean {
    return this.players.delete(userId);
  }

  /**
   * Check if room is at max capacity
   */
  isFull(): boolean {
    return this.players.size === this.MAX_PLAYERS;
  }

  /**
   * Get player info by user ID
   */
  getPlayerDate(userId: string): User {
    const player = this.players.get(userId);
    if (!player) throw new Error(`Player not found: userId=${userId}`);
    return player;
  }

  /**
   * Get all players in room with user IDs
   */
  getAllPlayersData(): PlayerInfo[] {
    return Array.from(this.players.entries()).map(([userId, data]) => ({
      userId,
      ...data,
    }));
  }

  /**
   * Get current player count
   */
  getCurrentPlayer(): number {
    return this.players.size;
  }
}

export default Room;
