import type { ConnId } from "../type/socket.js";
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
  addPlayer(connId: ConnId, nickname: string, avatar?: string): User {
    const playerInfo: User = {
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
  removePlayer(connId: ConnId): boolean {
    return this.players.delete(connId);
  }

  /**
   * Check if room is at max capacity
   */
  isFull(): boolean {
    return this.players.size === this.MAX_PLAYERS;
  }

  /**
   * Get player info by connection ID
   */
  getPlayerDate(connId: string): User {
    const player = this.players.get(connId);
    if (!player) throw new Error(`Player not found: connId=${connId}`);
    return player;
  }

  /**
   * Get all players in room with connection IDs
   */
  getAllPlayersData(): PlayerInfo[] {
    return Array.from(this.players.entries()).map(([connId, data]) => ({
      connId,
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
