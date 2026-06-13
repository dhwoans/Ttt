import WebSocket from "ws";
/**
 * @deprecated `WsSocketManager`와 함께 사용되던 ws 기반 세션 관리자. 현재 미사용.
 */
declare class SessionManager {
    sessionMap: Map<number, WebSocket>;
    constructor();
    /**
     * @param {number} userId
     * @param {WebSocket} ws
     */
    setConnId(userId: number, ws: WebSocket): boolean;
    /**
     * @param {number} userId - 조회할 유저의 고유 ID
     * @returns {WebSocket | undefined} 웹소켓 객체 또는 undefined
     */
    getConnId(userId: number): WebSocket | undefined;
    /**
     * @param {number} userId - 삭제할 유저의 고유 ID
     * @returns {boolean} 삭제 성공 여부
     */
    deleteConnId(userId: number): boolean;
    /**
     * @returns {number}
     */
    getTotalConnections(): number;
}
export default SessionManager;
//# sourceMappingURL=SessionManager.d.ts.map