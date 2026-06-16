import type { Request, Response, NextFunction } from "express";
import type RoomService from "../service/RoomService.js";
import { EVENT_LIST, eventshandler } from "../utils/eventhandler.js";
import type { roomInfo } from "../type/socket.js";
import crypto from "crypto";
import type { TicketResponse, TicketDto } from "../dtos/Ticket.dto.js";
import type RedisManager from "../utils/redis.js";

class ApiController {
  constructor(
    public roomService: RoomService,
    public redis: RedisManager,
  ) {}

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
      const result = this.roomService.createRoom(userId, nickname);
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
      const room = this.roomService.getRoomData(result.message);
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
        isFull: room.message.tree.players.length >= 2,
        currentPlayers: room.message.tree.players.length,
        maxPlayers: 2,
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
        const result = this.roomService.getRoomData(roomId);
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
        if (room.tree.players.length >= 2) {
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
      const result = this.roomService.getRoomList();
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
   * @param req - { userId, nickname, avatar }
   * @param res
   * @param next
   */
  async issueTicket(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("[ApiController] Ticket issuance request:", req.body);

      const { userId, nickname, avatar } = req.body;

      // 필수 값 체크 (구체적인 에러 메시지)
      const missingFields: string[] = [];
      if (!userId) missingFields.push("userId");
      if (!nickname) missingFields.push("nickname");

      if (missingFields.length > 0) {
        const errorMessage = `Missing required fields: ${missingFields.join(", ")}`;
        console.error(`[ApiController] Bad Request: ${errorMessage}`);
        res.status(400).json({
          success: false,
          message: errorMessage,
          required: ["userId", "nickname"],
          optional: ["avatar"],
        });
        return;
      }

      // 랜덤 티켓 생성 (16바이트 = 32자 hex 문자열)
      const ticket = `ticket_${crypto.randomBytes(16).toString("hex")}`;

      // 웹소켓 게임 서버 URL (환경 변수 또는 기본값 사용)
      const wsProtocol = process.env.WS_PROTOCOL || "ws";
      const wsHost = process.env.WS_HOST || "localhost";
      const wsPort = process.env.WS_PORT || process.env.PORT || "8080";
      const gameServerUrl = `${wsProtocol}://${wsHost}:${wsPort}`;

      // Redis에 티켓과 사용자 정보 저장 (60초 만료)
      const ticketData = {
        userId,
        nickname,
        avatar: avatar || null,
        createdAt: Date.now(),
      };

      const redisResult = await this.redis.setex(
        ticket,
        60,
        JSON.stringify(ticketData),
      );

      if (!redisResult) {
        console.error("[ApiController] Failed to save ticket to Redis");
        res.status(500).json({
          success: false,
          message: "Failed to create ticket: Redis storage error",
        });
        return;
      }

      console.log("[ApiController] ✅ Ticket issued successfully:", {
        ticket,
        userId,
        nickname,
        avatar,
        gameServerUrl,
        expiresIn: "60 seconds",
      });

      // 클라이언트가 기대하는 응답 형식
      const response: TicketResponse = {
        success: true,
        gameServerUrl,
        ticket,
        ttl: 60,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("[ApiController] ❌ Ticket issuance error:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? `Server error: ${error.message}`
            : "Internal server error",
      });
    }
  }
}

export default ApiController;
