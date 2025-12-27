class Sender {
    sessionManager;
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
}
export default Sender;
//# sourceMappingURL=Sender.js.map