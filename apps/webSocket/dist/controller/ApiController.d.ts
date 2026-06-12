import type { Request, Response, NextFunction } from "express";
import type RoomService from "../service/RoomService.js";
import type RedisManager from "../utils/redis.js";
declare class ApiController {
    roomService: RoomService;
    redis: RedisManager;
    constructor(roomService: RoomService, redis: RedisManager);
    checkHealth(req: Request, res: Response, next: NextFunction): number;
    /**
     *
     * @param req
     * @param res
     * @param next
     */
    createRoom(req: Request, res: Response, next: NextFunction): void;
    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns
     */
    checkRoom(req: Request, res: Response, next: NextFunction): void;
    /**
     * Get list of all available rooms
     */
    getRoomList(req: Request, res: Response, next: NextFunction): void;
    /**
     * 클라이언트 요청 시 티켓을 발급하고 웹소켓 서버 URL을 반환
     * @param req - { userId, nickname, avatar }
     * @param res
     * @param next
     */
    issueTicket(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default ApiController;
//# sourceMappingURL=ApiController.d.ts.map