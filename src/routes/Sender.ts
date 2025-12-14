import type SocketMessage from "../dtos/SocketMessage.dto.js";
import type SessionManager from "./SessionManager.js";

class Sender {
  constructor(public sessionManager: SessionManager) {}
  /**
   * 특정 유저에게 메시지 전송
   * @param {WebSocket} connId
   * @param {object} message
   */
  sendToUser(message:SocketMessage, connId:number): void {
    const ws = this.sessionManager.getConnId(connId);
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
  
}

export default Sender;
