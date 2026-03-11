/**
 * REST API 타입 정의
 *
 * 프론트엔드가 HTTP 요청/응답으로 주고받을 데이터 구조
 */

/**
 * POST /api/ticket 요청
 *
 * 게임 서버에 입장하기 위한 티켓을 발급받습니다.
 * 이 티켓은 Socket.IO 연결 시 auth.ticket으로 전달됩니다.
 */
export interface IssueTicketRequest {
  /** 사용자 고유 ID (최대 255자) */
  userId: string;

  /** 게임 내 표시될 닉네임 (최대 50자) */
  nickname: string;

  /** 플레이어 아바타 (선택), 예: "cat", "dog", "bear" */
  avatar?: string;

  /** 플레이어 실력 레벨 (선택), 1-10 사이의 숫자 */
  skilled?: boolean;
}

/**
 * POST /api/ticket 성공 응답
 */
export interface IssueTicketResponse {
  success: true;
  /** 게임 서버 Socket.IO 주소, 예: "ws://localhost:8080" */
  gameServerUrl: string;

  /** Socket.IO 연결 시 auth.ticket으로 사용할 일회용 키 */
  ticket: string;

  /** 티켓 만료 시간(초), 이 시간 내에 반드시 소켓 연결해야 함 */
  ttl: number;
}

/**
 * API 에러 응답
 */
export interface ApiErrorResponse {
  success: false;

  /** 에러 메시지 */
  message: string;

  /** 에러 코드 (선택) */
  code?: string;

  /** 누락된 필드 명시 (POST /api/ticket 실패 시) */
  missingFields?: string[];
}
