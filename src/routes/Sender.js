class Sender {
  constructor(sessionManager) {
    this.sessionManager = sessionManager;
  }
  /**
   * 특정 유저에게 메시지 전송
   * @param {WebSocket} connId
   * @param {object} message
   */
  sendToUser(message, connId) {
    const ws = this.sessionManager.getConnId(connId);
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * 특정 방의 모든 유저에게 전송 (Broadcast to Room)
   * @param {Map} playersMap - 해당 방의 플레이어 목록 (Manager에서 가져온 Map)
   * @param {object} message - 보낼 메시지 객체
   */
  sendToRoom(playersMap, message) {
    Array.from(playersMap.entries()).forEach(([connId, _]) => {
      const ws = this.sessionManager.getConnId(connId);
      if (ws && ws.readyState === ws.OPEN) {
        ws.send(message);
      } else {
        console.log("전송 실패");
      }
    });
  }
}

export default Sender;
