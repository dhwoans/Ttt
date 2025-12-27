import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type Service from "../service/Service.js";
import type User from "../dtos/user/User.dto.js";
import { EVENT_LIST, eventshandler } from "../utils/eventhandler.js";
import type { ConnId, EmitContext } from "../../type/socket.js";
import { EMIT_MODES } from "../../type/socket.js";

class WSController {
  constructor(public service: Service) {}

  /* ========================================================= */
  /* WS  처리                                                   */
  /* ========================================================= */

  /**
   * @description 게임방에 연결
   * @param rawMessage
   * @param connId
   */
  handleJoin(rawMessage: SocketMessage, connId: string): void {
    const { type, message, sender } = rawMessage;
    const [roomId, userId] = message;
    const checkRoomResult = this.service.checkRoom(roomId!);
    if (!checkRoomResult.success) {
      const errorMessage: SocketMessage = {
        type: "ERROR",
        message: ["잘못된 방에 접근"],
        sender: "system",
      };
      // this.sender.sendToUser(errorMessage, connId);
      eventshandler.emit(EVENT_LIST.ROOM_JOIN, {
        mode: EMIT_MODES.UNICAST,
        connId,
        payload: errorMessage,
      });
    } else {
      const room = checkRoomResult.message;
      if (room.players.size > 0) {
        // 나 빼고 먼저온 플레이어에게 내 정보 전달
        //방안에 있는 플레이어 정보
        const joinMessage: SocketMessage = {
          type: "JOIN",
          message: [userId!, "false"],
          sender,
        };
        eventshandler.emit(EVENT_LIST.ROOM_JOIN, {
          mode: EMIT_MODES.EXCEPT_ME,
          roomId,
          targetId: connId,
          payload: joinMessage,
        });
      }
      const result = this.service.joinPlayer(roomId!, userId!, sender);
      if (result.success) {
        //lobby 인원 증가이벤트 발생
        eventshandler.emit(EVENT_LIST.PLAYER_PLUS, roomId);
        //들어온 플레이어에게 플레이어정보 전달
        const players = room.getAllPlayersData();
        const messageList = players.map((player: any) => {
          return {
            type: "JOIN",
            message: [player.connId, player.isReady.toString()],
            sender: player.nickname,
          } as SocketMessage;
        });
        messageList.forEach((message: SocketMessage) => {
          //game join 이벤트 발생
          // this.sender.sendToUser(message, connId);
          eventshandler.emit(EVENT_LIST.ROOM_JOIN, {
            mode: EMIT_MODES.UNICAST,
            targetId: connId,
            payload: message,
          });
        });
      }
    }
  }

  /**
   * @description 채팅 처리
   * @param rawMessage
   */
  handleChat(rawMessage: SocketMessage): void {
    const { type, message, sender } = rawMessage;
    const [roomId, chat] = message;
    const result = this.service.checkRoom(roomId!);

    if (!result.success) {
      throw new Error(`${this.constructor.name} : 없는 방 조회`);
    } else {
      const chatMessage: SocketMessage = {
        type: "CHAT",
        message: [chat!],
        sender,
      };
      eventshandler.emit(EVENT_LIST.CHAT, {
        mode: EMIT_MODES.BROADCAST,
        roomId,
        payload: chatMessage,
      });
    }
  }

  /**
   * @description 게임방 퇴장 처리
   * @param rawMessage
   * @param connId
   */
  handleLeave(rawMessage: SocketMessage, connId: string): void {
    //남아있는 사람에게 알림
    const { type, message, sender } = rawMessage;
    const [roomId] = message;
    const removePlayerResult = this.service.removePlayer(roomId!, connId);
    if (removePlayerResult.success) {
      //lobby 인원 감소 or 방삭제 이벤트 발생
      eventshandler.emit(removePlayerResult.message, roomId);
      if (removePlayerResult.message === EVENT_LIST.PLAYER_MINUS) {
        const leaveMessage: SocketMessage = {
          type: "LEAVE",
          message: [connId, sender], //떠난사람
          sender: "system",
        };
        // room 에 남아있는 사람에게 메시지 전송
        eventshandler.emit(EVENT_LIST.LEAVE, {
          mode: EMIT_MODES.BROADCAST,
          roomId,
          payload: leaveMessage,
        });
      }
    } else {
      throw new Error(`${this.constructor.name} : 퇴장처리중오류`);
    }
  }
  /**
   * @description 플레이어 레디 처리
   * @param rawMessage
   * @param connId
   */
  handleReady(rawMessage: SocketMessage, connId: string) {
    const { type, message, sender } = rawMessage;
    const [roomId, status] = message;
    const result = this.service.readyPlayer(roomId!, connId, Boolean(status!));
    if (result) {
      const readyMessage: SocketMessage = {
        type: "READY",
        message: [connId, status!],
        sender: "system",
      };
      const checkRoomResult = this.service.checkRoom(roomId!);
      if (checkRoomResult.success) {
        eventshandler.emit(EVENT_LIST.READY, {
          mode: EMIT_MODES.BROADCAST,
          roomId,
          payload: readyMessage,
        });
      } else {
        throw Error(result.message);
      }
    }

    // 게임시작 확인
    const startGame = this.service.gameStart(roomId!);
    if (startGame.success) {
      //fsm on
      const result = this.service.getGameState(roomId!);
      // console.log(state.status);
      // console.log(state.currentTurn);
      // console.log(state.players);

      //게임시작 메시지 전송
      if (result.success) {
        const state = result.message.getState();
        const startMessage: SocketMessage = {
          type: state.status,
          message: [state.players[state.currentTurn]!.toString()],
          sender: "system",
        };
        // 플레이어들에게 알림
        const checkRoomResult = this.service.checkRoom(roomId!);
        if (checkRoomResult.success) {
          eventshandler.emit(EVENT_LIST.PLAYING, {
            mode: EMIT_MODES.BROADCAST,
            roomId,
            payload: startMessage,
          });
        } else {
          throw Error(result.message);
        }
      }
    }
  }
  /**
   *
   * @param rawMessage
   * @param connId
   */
  handleMove(rawMessage: SocketMessage, connId: string): void {
    const result = this.service.setMove(rawMessage);
    if (result.success) {
      const { type, message, sender } = rawMessage;
      const [roomId, index] = message;
      const state = this.service.getGameState(roomId!).message;
      //move 착수 위치
      const moveMessage: SocketMessage = {
        type: "MOVE",
        message: [sender, index!.toString()],
        sender: "system",
      };
      //다음턴 이나 게임 결과 전송
      console.log("state :", state);
      let nextMessage: SocketMessage;
      if (state.status === "GAME_OVER") {
        const winner =
          state.winner === -2 ? "DRAW" : state.players[state.winner];
        nextMessage = {
          type: state.status,
          message: [winner],
          sender: "system",
        };
      } else {
        nextMessage = {
          type: state.status,
          message: [state.players[state.currentTurn % 2]!.toString()],
          sender: "system",
        };
      }
      // 플레이어 전송
      const checkRoomResult = this.service.checkRoom(roomId!);
      if (checkRoomResult.success) {
        eventshandler.emit(EVENT_LIST.MOVE, {
          mode: EMIT_MODES.BROADCAST,
          roomId,
          payload: moveMessage,
        });
        eventshandler.emit(state.status, {
          mode: EMIT_MODES.BROADCAST,
          roomId,
          payload: nextMessage,
        });
      } else {
        throw Error(result.message);
      }
    } else {
      const errorMessage: SocketMessage = {
        type: "ERROR",
        message: [result.message],
        sender: "system",
      };
      eventshandler.emit(EVENT_LIST.ERROR, {
        mode: EMIT_MODES.UNICAST,
        targetId: connId,
        payload: errorMessage,
      });
    }
  }
}

export default WSController;
