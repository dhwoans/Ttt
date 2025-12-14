import Ttt from "../game/Ttt.js";
import Room from "./Room.js";
import PlayingState from "../gameState/PlayingState.js";
import type User from "../dtos/user/User.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type Action from "../dtos/Action.dto.js";
class Manager {
  rooms: Map<number, Room>;
  games: Map<number, Ttt>;

  constructor() {
    this.rooms = new Map();
    this.games = new Map();
  }

  /* ========================================================= */
  /* 방 관리                                                    */
  /* ========================================================= */

  /**
   * 새로운 방을 생성하고 두 인스턴스를 Map에 저장
   * @param {number} roomId
   * @returns {number}
   */
  createRoom(roomId: number): SuccessResponse | FailureResponse {
    this.rooms.set(roomId, new Room(2));
    if (!this.rooms.get(roomId)) {
      return {
        success: false,
        message: `${this.constructor.name} : 방생성 중 오류`,
      };
    }
    return { success: true };
  }

  /**
   * 방정보 반환
   * @param {number} roomId
   * @returns {object}
   */
  getRoomData(roomId: number): Room {
    const room = this.rooms.get(roomId);
    if (room) return room;
    else {
      throw new Error(`${this.constructor.name} : 존재하는 않는 방을 조회`);
    }
  }

  /**
   * 플레이어 입장 처리
   * @param {number} roomId
   * @param {number} connId
   * @param {number} nickname
   * @returns {object}
   */
  joinPlayer(
    roomId: number,
    connId: number,
    nickname: string
  ): SuccessResponse | FailureResponse {
    const room = this.rooms.get(roomId);
    if (!room || room.isFull()) {
      return {
        success: false,
        message: `${this.constructor.name} : 유저 입장 처리 중오류`,
      };
    }
    room.addPlayer(connId, nickname);
    return { success: true };
  }

  /**
   * 플레이어 퇴장 처리
   * @param {number} roomId
   * @param {number} connId
   * @param {number} nickname
   * @returns {Room}
   */
  removePlayer(
    roomId: number,
    connId: number
  ): SuccessResponse | FailureResponse {
    const room = this.rooms.get(roomId);

    if (room) {
      room.removePlayer(connId);
      // 플레이어 없는 방 폭파
      if (room.players.size === 0) {
        this.rooms.delete(roomId);
      }
      return { success: true };
    } else {
      return {
        success: false,
        message: `${this.constructor.name} : 유저 퇴장 처리 중 오류`,
      };
    }
  }

  /**
   * 모든 방의 roomId와 현재 플레이어 수를 반환
   * @returns {Array<object>} [{roomId: number, playerCount: number, isFull: boolean}]
   */
  getRoomList(): Array<object> {
    const rooms = [];
    for (const roomId of this.rooms.keys()) {
      const room = this.rooms.get(roomId);
      if (room) {
        if (room.players.size === 0) {
          // 플레이어 없는 방 폭파
          this.rooms.delete(roomId);
        } else {
          rooms.push({
            roomId: roomId,
            isFull: room.isFull(),
            currentPlayers: room.players.size,
            maxPlayers: room.MAX_PLAYERS,
          });
        }
      } else {
        throw new Error("방 정보는 있는데 플레이어 정보가 없음");
      }
    }
    return rooms;
  }
  /**
   *
   * @param roomId
   * @param connId
   * @param status
   * @returns
   */
  readyPlayer(
    roomId: number,
    connId: number,
    status: boolean
  ): SuccessResponse | FailureResponse {
    const player = this.rooms.get(roomId)?.getPlayerDate(connId);
    if (player) {
      player.isReady = status;
      return { success: true };
    } else
      return {
        success: false,
        message: `${this.constructor} : 레디할 플레이어가 존재하지 않음`,
      };
  }

  /* ========================================================= */
  /* 게임 관리                                                   */
  /* ========================================================= */

  /**
   * @description 게임 상태 조회
   * @param roomId
   * @returns Ttt
   */
  getGameDate(roomId: number): Ttt {
    const game = this.games.get(roomId);
    if (!game) {
      throw new Error(`${this.constructor} : 게임 조회 중 오류`);
    }
    return game;
  }

  /**
   * @description 게임 시작
   * @param roomId
   * @returns
   */
  gameStart(roomId: number): SuccessResponse | FailureResponse {
    //게임 생성
    this.games.set(roomId, new Ttt());
    const game = this.getGameDate(roomId);
    //플레이어 id 저장
    const room = this.getRoomData(roomId);
    for (const info of room.getAllPlayersData()) {
      game.setPlayersId(info.connId);
    }
    // 게임 시작
    game.changeState(new PlayingState());
    const state = game.getState();
    if (state.status !== "PLAYING")
      return {
        success: false,
        message: `${this.constructor} : 게임 시작처리 중 오류`,
      };
    if (state.players.length !== 2)
      return {
        success: false,
        message: `${this.constructor} : 플레이어 수 부족`,
      };
    return { success: true };
  }

  /**
   * @description 플레이어 행동처리
   * @param roomId
   * @param message
   * @returns
   */
  setMove(roomId: number, message: Action): SuccessResponse | FailureResponse {
    const game = this.getGameDate(roomId);

    const state = game.getState();
    if (state.status !== "PLAYING") {
      return {
        success: false,
        message: "",
      };
    }
    return game.processAction(message);
  }
  
  // /**
  //  * @description 게임 초기화
  //  * @param roomId
  //  * @param message
  //  * @returns
  //  */
  // setReset(roomId: number, message: Action): SuccessResponse | FailureResponse {
  //   const game = this.#getGameDate(roomId);
  //   const state = game.getState();
  //   if (state.status === "IDLE") {
  //     //이미 상대가 다시하기 누름
  //     return { success: true, message: "게임을 다시 시작 합니다." };
  //   } else {
  //     // 초기화 시작
  //     const result = game.processAction(message);
  //     if (result.success) {
  //       // 레디 최기화
  //       .players.clear();
  //     }
  //     return result;
  //   }
  // }
}
export default Manager;
