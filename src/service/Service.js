class Service {
  constructor(manager) {
    this.manager = manager;
  }
  /**
   * 방 생성
   * @param {number} userId
   * @param {string} nickname
   * @returns {number} roomId
   */
  createRoom(userId, nickname) {
    if (!userId || !nickname) {
      const error = new Error(
        `${this.constructor.name} : 정보가 누락되었습니다.`
      );
      error.status = 400;
      throw error;
    }
    const roomId = crypto.randomUUID();
    return this.manager.createRoom(roomId, userId, nickname);
  }
  /**
   * 실제로 방이 있는지 확인
   * @param {number} roomId
   * @returns
   */
  checkRoom(roomId) {
    const result = this.manager.getRoomData(roomId);
    if (result) {
      return result;
    } else {
      throw new Error(`${this.constructor.name} : room 정보 확인 불가`);
    }
  }

  /**
   * 모든 방의 roomId와 현재 플레이어 수를 반환
   * @returns {Array<object>} [{roomId: number, playerCount: number, isFull: boolean}]
   */
  getRoomList() {
    return this.manager.getRoomList();
  }
  /**
   * 플레이어 입장 처리
   * @param {number} roomId
   * @param {number} connId
   * @param {number} nickname
   * @returns {object}
   */
  joinPlayer(roomId, connId, nickname) {
    const playersMap = this.manager.joinPlayer(roomId, connId, nickname);
    const playerArray = Array.from(playersMap.players.entries()).map(
      ([userId, playerInfo]) => {
        return {
          userId: userId,
          nickname: playerInfo.nickname,
        };
      }
    );
    return playerArray;
  }
}

export default Service;
