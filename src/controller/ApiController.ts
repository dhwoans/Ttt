import type { Request, Response, NextFunction } from "express";
import type Service from "../service/Service.js";
import { EVENT_LIST, eventshandler } from "../utils/eventhandler.js";
import type { roomInfo } from "../type/socket.js";

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
      console.log("[ApiController] Room creation request");
      const { userId, nickname } = req.body;
      const result = this.service.createRoom(userId, nickname);
      if (!result.success || !result.message) {
        next(
          new Error(
            typeof result.message === "string"
              ? result.message
              : "Failed to create room"
          )
        );
        return;
      }
      const room = this.service.checkRoom(result.message);
      if (!room.success || !room.message) {
        next(
          new Error(
            typeof room.message === "string"
              ? room.message
              : "Failed to get room"
          )
        );
        return;
      }
      // 방생성 이벤트
      eventshandler.emit(EVENT_LIST.ROOM_CREATE, {
        roomId: result.message,
        isFull: room.message.isFull(),
        currentPlayers: room.message.players.size,
        maxPlayers: room.message.MAX_PLAYERS,
      } as roomInfo);
      // 방생성자 http 응답
      res.status(201).json({
        ...result,
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
  checkRoom(req: Request, res: Response, next: NextFunction): void {
    try {
      const roomId = req.query.roomId;
      if (!roomId) {
        console.log("[ApiController] Missing roomId parameter");
        next(new Error("roomId is required"));
        return;
      }
      if (typeof roomId === "string") {
        const result = this.service.checkRoom(roomId);
        if (!result.success || !result.message) {
          next(
            new Error(
              typeof result.message === "string"
                ? result.message
                : "Failed to get room"
            )
          );
          return;
        }
        const room = result.message;
        if (room.isFull()) {
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
   * Get list of all available rooms
   */
  getRoomList(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = this.service.getRoomList();
      console.log("[ApiController] Room list retrieved:", result);
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
