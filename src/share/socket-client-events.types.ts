/**
 * Socket.IO 클라이언트 → 서버 이벤트
 *
 * 프론트엔드가 emit할 수 있는 모든 이벤트와 payload 타입 정의
 */

/**
 * socket.emit("READY", { isReady: boolean })
 *
 * 플레이어가 게임 준비 상태를 변경합니다.
 * 모든 플레이어가 ready=true가 되면 서버가 자동으로 게임을 시작합니다.
 */
export interface ReadyEventPayload {
  /** true: 준비 완료, false: 준비 취소 */
  isReady: boolean;
}

/**
 * socket.emit("MOVE", { move: number })
 *
 * 틱택토 보드에 수를 놓습니다.
 * 보드는 3x3 = 9칸이며, 좌측상단부터 우측하단으로 0~8 인덱스를 가집니다.
 *
 * 인덱스 맵:
 * ```
 * 0 | 1 | 2
 * ---------
 * 3 | 4 | 5
 * ---------
 * 6 | 7 | 8
 * ```
 */
export interface MoveEventPayload {
  /** 놓을 위치의 인덱스 (0-8 사이의 숫자) */
  move: number;
}

/**
 * socket.emit("LEAVE")
 *
 * 방을 명시적으로 나갑니다.
 * 연결이 끊어지면 자동으로 처리되므로 필수는 아닙니다.
 */
export type LeaveEventPayload = Record<string, never>; // 빈 객체

/**
 * Socket.IO 클라이언트에서 emit할 수 있는 모든 이벤트
 *
 * @example
 * ```typescript
 * socket.emit("READY", { isReady: true });
 * socket.emit("MOVE", { move: 4 });
 * socket.emit("LEAVE");
 * ```
 */
export interface ClientEvents {
  READY: (payload: ReadyEventPayload) => void;
  MOVE: (payload: MoveEventPayload) => void;
  LEAVE: (payload?: LeaveEventPayload) => void;
}
