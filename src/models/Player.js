class Player {
  constructor() {
    this.players = new Map();
    this.MAX_PLAYERS = 2;
  }

  /**
   * 플레이어 추가
   * @param {number} connId - WebSocket 접속 ID
   * @param {string} nickname 
   * @returns {object} 
   */
  addPlayer(connId, nickname) {
    const currentPlayers = this.players.get(connId);
    if (currentPlayers >= this.MAX_PLAYERS) {
      throw new Error( `${this.constructor.name} : 인원이 초과되어 입장할 수 없습니다.`);
    }
    const playerInfo = {
      nickname: nickname,
      isReady: false,
    };
    // 플레이어 정보 객체 생성 및 Map에 저장
    this.players.set(connId,playerInfo);
    return playerInfo;
  }

  /**
   * 접속 ID로 플레이어를 Map에서 제거합니다.
   * @param {string} connId - WebSocket 접속 ID
   * @returns {boolean} 제거 성공 여부
   */
  removePlayer(connId) {
    return this.players.delete(connId);
  }

  /**
   * 방이 가득 찼는지 확인합니다.
   * @returns {boolean}
   */
  isFull() {
    return this.players.size === this.MAX_PLAYERS;
  }

  /**
   * 현재 방의 모든 플레이어 정보 목록을 반환
   * @returns {Array<Object>}
   */
  getAllPlayersData() {
    // Map의 values()와 keys()를 결합하여 {connId, nickname, symbol, ...} 배열 반환
    return Array.from(this.players.entries()).map(([connId, data]) => ({
      connId,
      ...data,
    }));
  }

  /**
   * 심볼로 플레이어 ID 찾기
   * @param {string} symbol - 'X' 또는 'O'
   * @returns {string | undefined} 해당 심볼을 가진 플레이어의 connId
   */
  getPlayerConnIdBySymbol(symbol) {
    for (const [connId, data] of this.players.entries()) {
      if (data.symbol === symbol) {
        return connId;
      }
    }
    return undefined;
  }

  /**
   * 현재 플레이어 수를 반환
   */
  count() {
    return this.players.size;
  }
}

export default Player;
