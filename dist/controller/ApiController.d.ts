import Sender from "../routes/Sender.js";
import type { Request, Response, NextFunction } from "express";
import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type Service from "../service/Service.js";
import type Controller from "./Controller.js";
declare class ApiController implements Controller {
    service: Service;
    sender: Sender;
    constructor(service: Service, sender: Sender);
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
     *
     * @param req
     * @param res
     * @param next
     */
    getRoomList(req: Request, res: Response, next: NextFunction): void;
    /**
     * @description 게임방에 연결
     * @param rawMessage
     * @param connId
     */
    handleJoin(rawMessage: SocketMessage, connId: number): void;
    /**
     * @description 채팅 처리
     * @param rawMessage
     */
    handleChat(rawMessage: SocketMessage): void;
    /**
     * @description 게임방 퇴장 처리
     * @param rawMessage
     * @param connId
     */
    handleLeave(rawMessage: SocketMessage, connId: number): void;
    /**
     * @description 플레이어 레디 처리
     * @param rawMessage
     * @param connId
     */
    handleReady(rawMessage: SocketMessage, connId: number): void;
    /**
     *
     * @param rawMessage
     * @param connId
     */
    handleMove(rawMessage: SocketMessage, connId: number): void;
}
export default ApiController;
//# sourceMappingURL=ApiController.d.ts.map