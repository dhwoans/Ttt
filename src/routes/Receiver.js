class Receiver {
  constructor(controller) {
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
   * 제어흐름 역할
   */
  handleMessage(message,connId) {
    const handler = this.routes[message.type];
    if (handler) {
      handler.call(this.controller, message, connId);
    } else {
      // 알 수 없는 타입 처리
      console.warn(`Unknown message type: ${message.type}`);
    }
  }
  handleDisconnect(id) {}
}
export default Receiver;
