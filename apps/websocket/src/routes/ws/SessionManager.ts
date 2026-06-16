import WebSocket from "ws";

/* ========================================================= */
/* 웹소켓 세션 관리                                          */
/* ========================================================= */
/**
 * @deprecated `WsSocketManager`와 함께 사용되던 ws 기반 세션 관리자. 현재 미사용.
 */
class SessionManager {
  sessionMap: Map<number, WebSocket>;

  constructor() {
    this.sessionMap = new Map();
  }

  /**
   * @param {number} userId
   * @param {WebSocket} ws
   */
  setConnId(userId: number, ws: WebSocket): boolean {
    if (!userId || !ws) {
      console.error("SessionManager: Invalid userId or ws provided.");
      return false;
    }

    // userId 저장
    this.sessionMap.set(userId, ws);
    ws.userId = userId;

    return true;
  }

  /**
   * @param {number} userId - 조회할 유저의 고유 ID
   * @returns {WebSocket | undefined} 웹소켓 객체 또는 undefined
   */
  getConnId(userId: number): WebSocket | undefined {
    return this.sessionMap.get(userId);
  }

  /**
   * @param {number} userId - 삭제할 유저의 고유 ID
   * @returns {boolean} 삭제 성공 여부
   */
  deleteConnId(userId: number): boolean {
    if (!userId) return false;

    // 해당 userId가 Map에 존재하면 삭제
    return this.sessionMap.delete(userId);
  }

  /**
   * @returns {number}
   */
  getTotalConnections(): number {
    return this.sessionMap.size;
  }
}

export default SessionManager;
