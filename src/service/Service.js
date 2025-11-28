import { randomUUID } from "node:crypto";
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
    const roomId = randomUUID();
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
  removePlayer(roomId, connId) {
    return this.manager.removePlayer(roomId, connId);
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
  readyPlayer(roomId, connId, status) {
    const playersMap = this.manager.readyPlayer(roomId, connId, status);
    const players = playersMap.getAllPlayersData();
    //게임 시작 검증
    if (playersMap.isFull) {
      for (const { connId, nickname, isReady } of players) {
        if (!isReady) {
          console.log("레디 안함");
          return [players, false];
        }
      }
      return [players, true];
    }
    console.log("인원 부족");
    return [players, false];
  }
}

export default Service;
