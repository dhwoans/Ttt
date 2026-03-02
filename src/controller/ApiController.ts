import type { Request, Response, NextFunction } from "express";
import type Service from "../service/Service.js";
import { EVENT_LIST, eventshandler } from "../utils/eventhandler.js";
import type { roomInfo } from "../type/socket.js";
import crypto from "crypto";
import type { TicketResponse, TicketDto } from "../dtos/Ticket.dto.js";

class ApiController {
  constructor(public service: Service) {}

  /* ========================================================= */
  /* Room API 처리 */
  /* ========================================================= */

  checkHealth(req: Request, res: Response, next: NextFunction) {
    return 1;
  }
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
              : "Failed to create room",
          ),
        );
        return;
      }
      const room = this.service.checkRoom(result.message);
      if (!room.success || !room.message) {
        next(
          new Error(
            typeof room.message === "string"
              ? room.message
              : "Failed to get room",
          ),
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
                : "Failed to get room",
            ),
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

  /* ========================================================= */
  /* Ticket API 처리 */
  /* ========================================================= */

  /**
   * 클라이언트 요청 시 티켓을 발급하고 웹소켓 서버 URL을 반환
   * @param req
   * @param res
   * @param next
   */
  issueTicket(req: Request, res: Response, next: NextFunction): void {
    try {
      console.log("[ApiController] Ticket issuance request");

      // 랜덤 티켓 생성 (16바이트 = 32자 hex 문자열)
      const ticket = `ticket_${crypto.randomBytes(16).toString("hex")}`;

      // 웹소켓 게임 서버 URL (환경 변수 또는 기본값 사용)
      const wsProtocol = process.env.WS_PROTOCOL || "ws";
      const wsHost = process.env.WS_HOST || "localhost";
      const wsPort = process.env.WS_PORT || process.env.PORT || "8080";
      const gameServerUrl = `${wsProtocol}://${wsHost}:${wsPort}`;

      // TODO: Redis에 티켓 저장 (60초 만료)
      // await redis.setex(ticket, 60, JSON.stringify({ valid: true }));

      console.log("[ApiController] Ticket issued:", {
        ticket,
        gameServerUrl,
        expiresIn: "60 seconds",
      });

      // 클라이언트가 기대하는 응답 형식
      const response: TicketResponse = {
        success: true,
        gameServerUrl,
        ticket,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("[ApiController] Ticket issuance error:", error);
      next(error);
    }
  }
}

export default ApiController;
