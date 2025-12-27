import type WSController from "../controller/WSContrller.js";
import type SocketMessage from "../dtos/SocketMessage.dto.js";

interface RoutesMap {
  [key: string]: (message: SocketMessage, connId: string) => void;
}

class Receiver {
  controller: WSController;
  routes: RoutesMap;

  constructor(controller: WSController) {
    this.controller = controller;
    this.routes = {
      JOIN: this.controller.handleJoin,
      LEAVE: this.controller.handleLeave,
      READY: this.controller.handleReady,
      CHAT: this.controller.handleChat,
      MOVE: this.controller.handleMove,
    };
  }
  /**
   * @description 흐름제어
   */
  handleMessage(message: SocketMessage, connId: string) {
    const handler = this.routes[message.type];
    if (handler) {
      handler.call(this.controller, message, connId);
    } else {
      // 알 수 없는 타입 처리
      console.warn(`Unknown message type: ${message.type}`);
    }
  }
}
export default Receiver;
