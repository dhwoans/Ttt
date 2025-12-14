import type Controller from "../controller/Controller.js";
import type SocketMessage from "../dtos/SocketMessage.dto.js";

interface RoutesMap {
  [key: string]: (message: SocketMessage, connId: number) => void;
}

class Receiver {
  controller: Controller;
  routes: RoutesMap;

  constructor(controller: Controller) {
    this.controller = controller;
    this.routes = {
      JOIN: this.controller.handleJoin,
      MOVE: this.controller.handleMove,
      LEAVE: this.controller.handleLeave,
      CHAT: this.controller.handleChat,
      READY: this.controller.handleReady,
    };
  }
  /**
   * @description 흐름제어
   */
  handleMessage(message: SocketMessage, connId: number) {
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
