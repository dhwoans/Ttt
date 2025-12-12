import Ttt from "../game/Ttt.js";
import Player from "./Player.js";
import PlayingState from "../gameState/PlayingState.js";

class Manager {
  constructor() {
    this.players = new Map();
    this.games = new Map();
  }

  /**
   * 새로운 방을 생성하고 두 인스턴스를 Map에 저장
   * @param {number} roomId
   * @param {number} userId
   * @param {string} nickname
   * @returns {object}
   */
  createRoom(roomId) {
    // GameInfo 생성
    const gameInfo = new Ttt();
    // PlayersInfo 생성
    const playersInfo = new Player();
    // playersInfo.addPlayer(userId, nickname);

    this.games.set(roomId, gameInfo);
    this.players.set(roomId, playersInfo);

    return roomId;
  }

  /**
   * 게임과 플레이어정보 반환
   * @param {number} roomId
   * @returns {object}
   */
  getRoomData(roomId) {
    return {
      game: this.games.get(roomId),
      players: this.players.get(roomId),
    };
  }

  /**
   * 플레이어 입장 처리
   * @param {number} roomId
   * @param {number} connId
   * @param {number} nickname
   * @returns {object}
   */
  joinPlayer(roomId, connId, nickname) {
    const playersInfo = this.players.get(roomId);
    if (!playersInfo || playersInfo.isFull()) {
      throw new Error(
        `${this.constructor.name} : 입장할 수 없습니다.`
      );
    }
    playersInfo.addPlayer(connId, nickname, false);
    return playersInfo;
  }

  /**
   * 플레이어 퇴장 처리
   * @param {number} roomId
   * @param {number} connId
   * @param {number} nickname
   * @returns {object}
   */
  removePlayer(roomId, connId) {
    const playersInfo = this.players.get(roomId);

    if (playersInfo) {
      playersInfo.removePlayer(connId);
    }

    // 만약 플레이어가 0명이 되면 방을 파괴
    if (playersInfo && playersInfo.count() === 0) {
      this.games.delete(roomId);
      this.players.delete(roomId);
      return null;
    }
    return playersInfo;
  }

  /**
   * 모든 방의 roomId와 현재 플레이어 수를 반환
   * @returns {Array<object>} [{roomId: number, playerCount: number, isFull: boolean}]
   */
  getRoomList() {
    const rooms = [];
    for (const roomId of this.games.keys()) {
      const playersInfo = this.players.get(roomId);

      if (playersInfo) {
        rooms.push({
          roomId: roomId,
          playerCount: playersInfo.count(),
          isFull: playersInfo.isFull(),
          maxPlayers: playersInfo.MAX_PLAYERS,
        });
      } else {
        return new Error("방 정보는 있는데 플레이어 정보가 없음");
      }
    }
    return rooms;
  }
  /**
   * 플레이어 레디 처리
   * @param {number} roomId
   * @param {number} connId
   * @param {number} nickname
   * @returns {object}
   */
  readyPlayer(roomId, connId, status) {
    const playersInfo = this.players.get(roomId);
    const player = playersInfo.getPlayerDate(connId);
    player.isReady = status;

    return playersInfo;
  }
  gameStart(roomId) {
    const result = this.getRoomData(roomId);
    const { players, game } = result;
    //플레이어 넘겨줌
    game.setPlayers(players.players);
    game.changeState(new PlayingState());
    return game.getState();
  }
  move(message) {
    const [roomId, move] = message.message;
    const info = this.getRoomData(roomId);
    const { players, game } = info;
    const result = game.processAction(message);
    console.log(result);
    return result;
  }
  reset(message) {
    const roomId = message.message;
    const { game, players } = this.getRoomData(roomId);
    const state = game.getState();
    if (state.status === "IDLE") {
      //이미 상대가 다시하기 누름
      return { success: true, message: "게임을 다시 시작 합니다." };
    } else {
      // 초기화 시작
      const result = game.processAction(message);
      console.log(result);
      if (result.success) {
        // 룸상태 초기화
        players.players.clear();
      }
      return result;
    }
  }
}
export default Manager;
