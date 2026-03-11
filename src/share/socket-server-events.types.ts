/**
 * Socket.IO 서버 → 클라이언트 이벤트
 *
 * 프론트엔드가 listen할 수 있는 모든 이벤트와 payload 타입 정의
 */

/**
 * socket.on("CONNECTED", ...)
 *
 * 소켓 연결이 성공했을 때 발생합니다.
 * 이벤트 수신 직후 ROOM_ASSIGNED 등을 기다립니다.
 */
export interface ConnectedEvent {
  success: true;
  socketId: string;
  message: string;
}

/**
 * socket.on("ROOM_ASSIGNED", ...)
 *
 * 방이 할당되었을 때 발생합니다.
 * 클라이언트는 이 roomId를 나중의 모든 통신에서 참조합니다.
 */
export interface RoomAssignedEvent {
  roomId: string;
}

/**
 * socket.on("EXISTING_PLAYERS", ...)
 *
 * 방에 이미 있는 플레이어 목록을 받습니다.
 * 새로 입장한 플레이어에게만 발송됩니다.
 */
export interface ExistingPlayersEvent {
  /** 방에 이미 있는 플레이어 목록 */
  players: PlayerData[];
  roomId: string;
}

/** 플레이어 기본 정보 */
export interface PlayerData {
  /** 플레이어 소켓/연결 ID */
  connId: string;
  /** 닉네임 */
  nickname: string;
  /** 게임 준비 여부 */
  isReady: boolean;
  /** 아바타 키 (예: "cat", "dog") */
  avatar?: string;
  /** 실력 레벨 */
  skilled?: boolean;
}

/**
 * socket.on("PLAYER_JOINED", ...)
 *
 * 새 플레이어가 방에 입장했을 때 발생합니다.
 * 기존 플레이어들에게만 발송됩니다.
 */
export interface PlayerJoinedEvent {
  player: PlayerData;
  roomId: string;
}

/**
 * socket.on("PLAYER_READY", ...)
 *
 * 플레이어의 준비 상태가 변경되었을 때 발생합니다.
 * 방 전체 플레이어에게 브로드캐스트됩니다.
 */
export interface PlayerReadyEvent {
  connId: string;
  nickname: string;
  avatar?: string;
  isReady: boolean;
  roomId: string;
}

/**
 * socket.on("PLAYING", ...)
 *
 * 모든 플레이어가 ready=true가 되면 게임이 시작되고 이벤트가 발생합니다.
 * 게임 시작 시점에 누가 첫 턴인지 정보가 포함됩니다.
 */
export interface PlayingEvent {
  roomId: string;
  /** 게임 상태: "PLAYING" */
  status: "PLAYING";
  /** 현재 턴을 할 플레이어 ID */
  currentTurnPlayerId: string;
  /** 게임에 참가한 플레이어 ID 배열 [player1, player2] */
  players: string[];
}

/**
 * socket.on("MOVE_MADE", ...)
 *
 * 플레이어가 수를 놓았을 때 발생합니다.
 * 방 전체 플레이어에게 브로드캐스트됩니다.
 */
export interface MoveMadeEvent {
  /** 수를 놓은 플레이어의 connId */
  connId: string;
  /** 0-8 사이 인덱스 (MOVE 이벤트와 동일 포맷) */
  move: number;
}

/**
 * socket.on("NEXT_TURN", ...)
 *
 * 게임이 진행 중 다음 턴 플레이어가 정해졌을 때 발생합니다.
 * 방 전체 플레이어에게 브로드캐스트됩니다.
 */
export interface NextTurnEvent {
  roomId: string;
  /** 턴 카운트 (0부터 증가) */
  currentTurn: number;
  /** 다음 턴을 할 플레이어 ID */
  nextPlayerId: string;
}

/**
 * socket.on("GAME_OVER", ...)
 *
 * 게임이 종료되면 발생합니다.
 * 방 전체 플레이어에게 브로드캐스트됩니다.
 */
export interface GameOverEvent {
  roomId: string;
  /** "win": 승자 있음, "draw": 무승부 */
  result: "win" | "draw";
  /** 승자 ID (무승부일 때는 null) */
  winner: string | null;
  /** 승자의 플레이어 인덱스 */
  winnerIndex: number;
  /** 최종 보드 상태 (각 칸: 플레이어 ID 또는 "") */
  board: (string | "")[];
}

/**
 * socket.on("PLAYER_LEFT", ...)
 *
 * 플레이어가 방을 나갔을 때 발생합니다.
 * 같은 방의 다른 플레이어들에게만 발송됩니다.
 */
export interface PlayerLeftEvent {
  connId: string;
  nickname: string;
  avatar?: string;
  roomId: string;
}

/**
 * socket.on("LEAVE_SUCCESS", ...)
 *
 * 본인이 방을 성공적으로 나갔을 때 발생합니다.
 * 나간 본인에게만 발송됩니다.
 */
export interface LeaveSuccessEvent {
  success: true;
  message: string;
}

/**
 * socket.on("ERROR", ...)
 *
 * 에러가 발생했을 때 발생합니다.
 */
export interface ErrorEvent {
  message: string;
  roomId?: string;
}

/**
 * Socket.IO 서버에서 emit할 수 있는 모든 이벤트
 *
 * @example
 * ```typescript
 * socket.on("CONNECTED", (data: ConnectedEvent) => { ... });
 * socket.on("PLAYING", (data: PlayingEvent) => { ... });
 * socket.on("MOVE_MADE", (data: MoveMadeEvent) => { ... });
 * socket.on("GAME_OVER", (data: GameOverEvent) => { ... });
 * ```
 */
export interface ServerEvents {
  CONNECTED: (data: ConnectedEvent) => void;
  ROOM_ASSIGNED: (data: RoomAssignedEvent) => void;
  EXISTING_PLAYERS: (data: ExistingPlayersEvent) => void;
  PLAYER_JOINED: (data: PlayerJoinedEvent) => void;
  PLAYER_READY: (data: PlayerReadyEvent) => void;
  PLAYING: (data: PlayingEvent) => void;
  MOVE_MADE: (data: MoveMadeEvent) => void;
  NEXT_TURN: (data: NextTurnEvent) => void;
  GAME_OVER: (data: GameOverEvent) => void;
  PLAYER_LEFT: (data: PlayerLeftEvent) => void;
  LEAVE_SUCCESS: (data: LeaveSuccessEvent) => void;
  ERROR: (data: ErrorEvent) => void;
}
