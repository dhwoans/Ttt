import type { Request, Response, NextFunction } from "express";
import type Service from "../service/Service.js";
import { EVENT_LIST, eventshandler } from "../utils/eventhandler.js";
import type { roomInfo } from "../../type/socket.js";

class ApiController {
  constructor(public service: Service) {}

  /* ========================================================= */
  /* API 처리 */
  /* ========================================================= */

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  createRoom(req: Request, res: Response, next: NextFunction): void {
    try {
      console.log(this.constructor.name, " : 방생성 요청");
      const { userId, nickname } = req.body;
      const result = this.service.createRoom(userId, nickname);
      const room = this.service.checkRoom(result.message);
      // 방생성 이벤트
      eventshandler.emit(EVENT_LIST.ROOM_CREATE, {
        roomId: result.message,
        isFull: room.message.isFull(),
        currentPlayers: room.message.players.size,
        maxPlayers: room.message.MAX_PLAYERS,
      } as roomInfo);
      if (result.success) {
        // 방생성자 http 응답
        res.status(201).json({
          ...result,
        });
      } else {
        next(new Error(result.message));
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
        const result = this.service.checkRoom(roomId);
        if (!result.success) {
          next(new Error(result.message));
        } else {
          const room = result.message;
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
      console.log("getRoomList", result);
      res.status(200).json({
        success: true,
        roomList: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ApiController;
