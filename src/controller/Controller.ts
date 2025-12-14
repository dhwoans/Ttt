import type { Request, Response, NextFunction } from "express";
import type SocketMessage from "../dtos/SocketMessage.dto.js";

export default interface Controller {
  // ------------------------------------
  // HTTP API 핸들러
  // ------------------------------------
  createRoom(req: Request, res: Response, next: NextFunction): void;
  checkRoom(req: Request, res: Response, next: NextFunction): void;
  getRoomList(req: Request, res: Response, next: NextFunction): void;

  // ------------------------------------
  // Websocket 메시지 핸들러
  // ------------------------------------
  handleJoin(rawMessage: SocketMessage, connId: number): void;
  handleChat(rawMessage: SocketMessage): void;
  handleLeave(rawMessage: SocketMessage, connId: number): void;
  handleReady(rawMessage: SocketMessage, connId: number): void;
  handleMove(rawMessage: SocketMessage, connId: number): void;
}
