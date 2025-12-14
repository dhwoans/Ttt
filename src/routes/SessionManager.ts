/* ========================================================= */
/* 웹소켓 세션 관리                                             */
/* ========================================================= */
class SessionManager {
  sessionMap:Map<number,WebSocket>
  constructor() {
    this.sessionMap = new Map(); // key : userId , value : ws (WebSocket object)
  }

  /**
   * @param {string} userId 
   * @param {WebSocket} ws
   */
  setConnId(userId:number, ws:WebSocket) {
    if (!userId || !ws) {
      console.error("SessionManager: Invalid userId or ws provided.");
      return false;
    }
    this.sessionMap.set(userId, ws);
    ws.userId = userId;
    return true;
  }

  /**
   * @param {string} userId - 조회할 유저의 고유 ID
   * @returns {WebSocket | undefined} 웹소켓 객체 또는 undefined
   */
  getConnId(userId) {
    return this.sessionMap.get(userId);
  }

  /**
   * @param {string} userId - 삭제할 유저의 고유 ID
   * @returns {boolean} 삭제 성공 여부
   */
  deleteConnId(userId) {
    if (!userId) return false;

    // 해당 userId가 Map에 존재하면 삭제
    return this.sessionMap.delete(userId);
  }

  /**
   * @returns {number}
   */
  getTotalConnections() {
    return this.sessionMap.size;
  }
}

export default SessionManager;
