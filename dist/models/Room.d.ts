import type User from "../dtos/user/User.dto.js";
declare class Room {
    players: Map<number, User>;
    MAX_PLAYERS: number;
    constructor(max: number);
    /**
     * 플레이어 추가
     * @param {number} connId - WebSocket 접속 ID
     * @param {string} nickname
     * @returns {object}
     */
    addPlayer(connId: number, nickname: string): User;
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
    /**
     * 방안 특정 플레이어 정보 목록을 반환
     * @returns
     */
    getPlayerDate(connId: number): {
        nickname: string;
        isReady: boolean;
    };
    /**
     * 방안 모든 플레이어 정보 목록을 반환
     * @returns {Array<Object>}
     */
    getAllPlayersData(): Array<{
        connId: number;
        nickname: string;
        isReady: boolean;
    }>;
    /**
     * 현재 플레이어 수를 반환
     */
    getCurrentPlayer(): number;
}
export default Room;
//# sourceMappingURL=Room.d.ts.map