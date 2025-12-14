import type User from "../dtos/user/User.dto.js";

class Room {
  players: Map<number, User>;
  MAX_PLAYERS: number;

  constructor(max: number) {
    this.players = new Map();
    this.MAX_PLAYERS = max;
  }

  /**
   * 플레이어 추가
   * @param {number} connId - WebSocket 접속 ID
   * @param {string} nickname
   * @returns {object}
   */
  addPlayer(connId: number, nickname: string): User {
    const playerInfo: User = {
      nickname: nickname,
      isReady: false,
    };
    // 플레이어 정보 객체 생성 및 Map에 저장
    this.players.set(connId, playerInfo);
    return playerInfo;
  }

  /**
   * 접속 ID로 플레이어를 Map에서 제거
   * @param {string} connId - WebSocket 접속 ID
   * @returns {boolean} 제거 성공 여부
   */
  removePlayer(connId: number): boolean {
    return this.players.delete(connId);
  }

  /**
   * 방이 가득 찼는지 확인
   * @returns {boolean}
   */
  isFull(): boolean {
    return this.players.size === this.MAX_PLAYERS;
  }
  /**
   * 방안 특정 플레이어 정보 목록을 반환
   * @returns
   */
  getPlayerDate(connId: number): { nickname: string; isReady: boolean } {
    const player = this.players.get(connId);
    if (!player)
      throw new Error(`${this.constructor.name} : 존재 하지 않는 플레이어`);
    return player;
  }
  /**
   * 방안 모든 플레이어 정보 목록을 반환
   * @returns {Array<Object>}
   */
  getAllPlayersData(): Array<{
    connId: number;
    nickname: string;
    isReady: boolean;
  }> {
    return Array.from(this.players.entries()).map(([connId, data]) => ({
      connId,
      ...data,
    }));
  }

  /**
   * 현재 플레이어 수를 반환
   */
  getCurrentPlayer(): number {
    return this.players.size;
  }
}

export default Room;
