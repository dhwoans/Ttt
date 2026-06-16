export interface UserState {
  id: string; // UUID 또는 DB 고유 ID
  nickname: string;
  avator: string;
  lastActive: number; // 타임스탬프 (Date.now())
}
