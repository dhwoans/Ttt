import Sender from "../routes/Sender.js";
import type { Request, Response, NextFunction } from "express";
import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type Service from "../service/Service.js";
import type Controller from "./Controller.js";

class ApiController implements Controller {
  constructor(public service: Service, public sender: Sender) {}

  /* ========================================================= */
  /* API 처리 */
  /* ========================================================= */

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(this.constructor.name, " : 방생성 요청");
      const { userId, nickname } = req.body;
      const roomId = this.service.createRoom(userId, nickname);
      res.status(201).json({
        success: true,
        roomId,
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  checkRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = req.query.roomId;
      if (!roomId) {
        console.log(this.constructor.name, " roomId 누락");
        next(new Error("roomId 누락"));
      }
      if (typeof roomId === "string") {
        const room = this.service.checkRoom(parseInt(roomId));
        if (!room) {
          return next(new Error("없는 방에 접근"));
        }
        if (room.isFull()) {
          //클라이언트 강제 새로고침
          res.status(300).json({
            success: false,
          });
        } else {
          res.status(200).json({
            success: true,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  getRoomList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = this.service.getRoomList();

      res.status(200).json({
        success: true,
        roomList: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ========================================================= */
  /* WS  처리                                                   */
  /* ========================================================= */

  /**
   * @description 게임방에 연결
   * @param rawMessage
   * @param connId
   */
  handleJoin(rawMessage: SocketMessage, connId: number): void {
    // 클라이언트 새로 고침시 채팅내역,플레이어정보,log
    const { type, message, sender } = rawMessage;
    const [roomId, userId] = message;
    const room = this.service.checkRoom(parseInt(roomId!));
    if (!room) {
      const errorMessage: SocketMessage = {
        type: "ERROR",
        message: ["잘못된 방에 접근"],
        sender: "system",
      };
      this.sender.sendToUser(errorMessage, connId);
    }

    if (room.players.size === 1) {
      // 먼저온 플레이어에게 전하기
      const joinMessage: SocketMessage = {
        type: "JOIN",
        message: [connId.toString()],
        sender,
      };
      room.players.forEach((value, player) => {
        this.sender.sendToUser(joinMessage, player);
      });
    }

    const result = this.service.joinPlayer(
      parseInt(roomId!),
      parseInt(userId!),
      sender
    );
    if (result) {
      //들어온 플레이어에게 방정보 전하기
      const room = this.service.checkRoom(parseInt(roomId!));
    }
  }

  /**
   * @description 채팅 처리
   * @param rawMessage
   */
  handleChat(rawMessage: SocketMessage): void {
    const { type, message, sender } = rawMessage;
    const [roomId, chat] = message;
    const room = this.service.checkRoom(parseInt(roomId!));

    if (!room) throw new Error(`${this.constructor.name} : 없는 방 조회`);
    const chatMessage: SocketMessage = {
      type: "CHAT",
      message: [chat!],
      sender,
    };
    const players = room.getAllPlayersData();
    for (const [connId, playerInfo] of players.entries()) {
      this.sender.sendToUser(chatMessage, connId);
    }
    //
  }

  /**
   * @description 게임방 퇴장 처리
   * @param rawMessage
   * @param connId
   */
  handleLeave(rawMessage: SocketMessage, connId: number): void {
    //게임 상태에 따라 다르게 처리
    //남아있는 사람에게 알림
    const { type, message, sender } = rawMessage;
    const [roomId] = message;
    const nickname = rawMessage.sender;
    console.log("leave :", roomId);
    const result = this.service.removePlayer(parseInt(roomId!), connId);
    if (result) {
      const sendMessage: SocketMessage = {
        type: "LEAVE",
        message: [connId.toString(), sender], //떠난사람
        sender: "system",
      };
      // 방안에 남아있는 사람에게 메시지 전송
      const players = this.service
        .checkRoom(parseInt(roomId!))
        ?.getAllPlayersData();
      for (const [connId, _] of players.entries()) {
        this.sender.sendToUser(sendMessage, connId);
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
  handleReady(rawMessage: SocketMessage, connId: number) {
    const { type, message, sender } = rawMessage;
    const [roomId, status] = message;
    const result = this.service.readyPlayer(
      parseInt(roomId!),
      connId,
      Boolean(status!)
    );
    if (result) {
      const readyMessage: SocketMessage = {
        type: "READY",
        message: [connId.toString(), status!.toString()],
        sender: "system",
      };
      const players = this.service
        .checkRoom(parseInt(roomId!))
        ?.getAllPlayersData();

      for (const connId of players.keys()) {
        this.sender.sendToUser(readyMessage, connId);
      }
    }

    //게임시작 확인
    const startGame = this.service.gameStart(parseInt(roomId!));
    if (startGame) {
      //fsm on
      const state = this.service.getGameState(parseInt(roomId!));
      // console.log(state.status);
      // console.log(state.currentTurn);
      // console.log(state.players);

      //게임시작 메시지 전송
      const startMessage: SocketMessage = {
        type: state.status,
        message: [state.players[state.currentTurn]!.toString()],
        sender: "system",
      };
      console.log(startMessage);
      // 플레이어들에게 알림
      const players = this.service
        .checkRoom(parseInt(roomId!))
        ?.getAllPlayersData();

      for (const connId of players.keys()) {
        this.sender.sendToUser(startMessage, connId);
      }
    }
  }
  /**
   *
   * @param rawMessage
   * @param connId
   */
  handleMove(rawMessage: SocketMessage, connId: number): void {
    const result = this.service.setMove(rawMessage);
    if (result.success) {
      const { type, message, sender } = rawMessage;
      const [roomId, index] = message;
      const state = this.service.getGameState(parseInt(roomId!));
      //move 브로드캐스트
      const moveMessage: SocketMessage = {
        type: "MOVE",
        message: [sender, index!.toString()],
        sender: "system",
      };
      //다음턴 이나 게임 결과 전송
      const nextTurnMessage: SocketMessage = {
        type: state.status,
        message:
          state.status === "PLAYING"
            ? [state.players[state.currentTurn % 2]!.toString()]
            : [state.winner.toString()], // userId or 0
        sender: "system",
      };
      // 플레이어 전송
      const players = this.service
        .checkRoom(parseInt(roomId!))
        .getAllPlayersData();
      for (const connId of players.keys()) {
        this.sender.sendToUser(moveMessage, connId);
        this.sender.sendToUser(nextTurnMessage, connId);
      }
    } else {
      const errorMessage: SocketMessage = {
        type: "ERROR",
        message: [result.message],
        sender: "system",
      };
      this.sender.sendToUser(errorMessage, connId);
    }
  }
}

export default ApiController;
