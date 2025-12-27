import Ttt from "../game/Ttt.js";
import Room from "../models/Room.js";
import PlayingState from "../gameState/PlayingState.js";
import type User from "../dtos/user/User.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type Action from "../dtos/Action.dto.js";
import { EVENT_LIST } from "../utils/eventhandler.js";
import type { ConnId, Nickname, RoomId } from "../../type/socket.js";
class Manager {
  rooms: Map<RoomId, Room>;
  games: Map<RoomId, Ttt>;

  constructor() {
    this.rooms = new Map();
    this.games = new Map();
  }

  /* ========================================================= */
  /* 대기실 관리                                                    */
  /* ========================================================= */

  /**
   * 새로운 방을 생성하고 두 인스턴스를 Map에 저장
   * @param {number} roomId
   * @returns {number}
   */
  createRoom(roomId: RoomId): SuccessResponse | FailureResponse {
    this.rooms.set(roomId, new Room(2));
    if (!this.rooms.get(roomId)) {
      return {
        success: false,
        message: `${this.constructor.name} : 방생성 중 오류`,
      };
    }
    return { success: true, message: roomId };
  }

  /**
   * 방정보 반환
   * @param {number} roomId
   * @returns {object}
   */
  getRoomData(roomId: RoomId): SuccessResponse | FailureResponse {
    const room = this.rooms.get(roomId);
    if (room) return { success: true, message: room as Room };
    else {
      return { success: false, message: "존재하는 않는 방을 조회" };
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
    roomId: RoomId,
    connId: ConnId,
    nickname: Nickname
  ): SuccessResponse | FailureResponse {
    const room = this.rooms.get(roomId);
    if (!room || room.isFull()) {
      return {
        success: false,
        message: `${this.constructor.name} : 유저 입장 처리 중오류`,
      };
    }
    room.addPlayer(connId, nickname);
    return { success: true, message: roomId };
  }

  /**
   * 플레이어 퇴장 처리
   * @param {number} roomId
   * @param {number} connId
   * @param {number} nickname
   * @returns {Room}
   */
  removePlayer(
    roomId: RoomId,
    connId: ConnId
  ): SuccessResponse | FailureResponse {
    const room = this.rooms.get(roomId);

    if (room) {
      room.removePlayer(connId);
      // 플레이어 없는 방 폭파
      if (room.players.size === 0) {
        this.rooms.delete(roomId);
        return { success: true, message: EVENT_LIST.ROOM_REMOVE }; // 방폭파
      } else {
        return { success: true, message: EVENT_LIST.PLAYER_MINUS }; // 인원감소
      }
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
    const roomList = [];
    for (const roomId of this.rooms.keys()) {
      const room = this.rooms.get(roomId);
      if (room) {
        if (room.players.size === 0) {
          // 플레이어 없는 방 폭파
          this.rooms.delete(roomId);
        } else {
          roomList.push({
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
    return roomList;
  }
  /**
   *
   * @param roomId
   * @param connId
   * @param status
   * @returns
   */
  readyPlayer(
    roomId: RoomId,
    connId: ConnId,
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
  getGameDate(roomId: RoomId): SuccessResponse | FailureResponse {
    const game = this.games.get(roomId);
    if (!game) {
      return { success: false, message: "게임 조회 실패" };
    }
    return { success: true, message: game as Ttt };
  }

  /**
   * @description 게임 시작
   * @param roomId
   * @returns
   */
  gameStart(roomId: RoomId): SuccessResponse | FailureResponse {
    //게임 생성
    this.games.set(roomId, new Ttt());
    const game = this.games.get(roomId);
    const room = this.rooms.get(roomId);
    if (game && room) {
      //플레이어 id 저장
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
    } else {
      return {
        success: false,
        message: `${this.constructor} : 비정상적 게임 시작`,
      };
    }
  }
  /**
   *
   * @param roomId
   * @param message
   * @returns
   */
  setMove(roomId: RoomId, message: Action): SuccessResponse | FailureResponse {
    const game = this.games.get(roomId);
    if (game) {
      const state = game.getState();
      if (state.status !== "PLAYING") {
        return {
          success: false,
          message: "",
        };
      }
      return game.processAction(message);
    } else {
      return {
        success: false,
        message: `${this.constructor.name} : "착수 중 게임 조회 실패" `,
      };
    }
  }
}
export default Manager;
