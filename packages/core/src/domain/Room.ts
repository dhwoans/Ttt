export interface PlayerData {
  userId: string;
  nickname: string;
  isReady: boolean;
  avatar?: string;
}

export default class Room {
  players: Map<string, PlayerData>;
  MAX_PLAYERS: number;

  constructor(max: number = 2) {
    this.players = new Map();
    this.MAX_PLAYERS = max;
  }

  addPlayer(userId: string, nickname: string, avatar?: string): PlayerData {
    const playerData: PlayerData = {
      userId,
      nickname,
      isReady: false,
      ...(avatar && { avatar }),
    };
    this.players.set(userId, playerData);
    return playerData;
  }

  removePlayer(userId: string): boolean {
    return this.players.delete(userId);
  }

  isFull(): boolean {
    return this.players.size === this.MAX_PLAYERS;
  }

  getPlayer(userId: string): PlayerData {
    const player = this.players.get(userId);
    if (!player) throw new Error(`Player not found: userId=${userId}`);
    return player;
  }

  getAllPlayers(): PlayerData[] {
    return Array.from(this.players.values());
  }

  readyPlayer(userId: string, isReady: boolean): void {
    const player = this.getPlayer(userId);
    player.isReady = isReady;
  }

  allReady(): boolean {
    return this.isFull() && this.getAllPlayers().every((p) => p.isReady);
  }

  resetReady(): void {
    this.players.forEach((p) => (p.isReady = false));
  }
}
