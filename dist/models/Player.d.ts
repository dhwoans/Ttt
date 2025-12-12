interface PlayerInfo {
    nickname: string;
    isReady: boolean;
}
declare class Player {
    players: Map<number, PlayerInfo>;
    MAX_PLAYERS: number;
    constructor();
    /**
     * 플레이어 추가
     * @param {number} connId - WebSocket 접속 ID
     * @param {string} nickname
     * @returns {object}
     */
    addPlayer(connId: number, nickname: string): PlayerInfo;
    /**
     * 접속 ID로 플레이어를 Map에서 제거
     * @param {string} connId - WebSocket 접속 ID
     * @returns {boolean} 제거 성공 여부
     */
    removePlayer(connId: number): boolean;
    /**
     * 방이 가득 찼는지 확인
     * @returns {boolean}
     */
    isFull(): boolean;
    getPlayerDate(connId: number): PlayerInfo | undefined;
    /**
     * 현재 방의 모든 플레이어 정보 목록을 반환
     * @returns {Array<Object>}
     */
    getAllPlayersData(): Array<object>;
    /**
     * 현재 플레이어 수를 반환
     */
    count(): number;
}
export default Player;
//# sourceMappingURL=Player.d.ts.map