/**
 * @description 방안에 있는 플레이어
 */
export default interface User {
  nickname: string;
  isReady: boolean;
  avatar?: string;
}

/**
 * @description 방의 모든 플레이어 정보 (userId 포함)
 */
export interface PlayerInfo extends User {
  userId: string;
}
