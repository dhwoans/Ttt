export interface Action {
  type: string;
  move: number;
  nickname: string;
}

export interface SuccessResponse<T = void> {
  success: true;
  message?: T;
}

export interface FailureResponse {
  success: false;
  message: string;
}

export type Response<T = void> = SuccessResponse<T> | FailureResponse;

export type UserId = string;

export type GameStatus = "IDLE" | "PLAYING" | "GAME_OVER";
export type PlayerSymbol = "X" | "O" | "";

export interface PlayerNode {
  id: string;
}

export interface MoveNode {
  index: number;
  symbol: PlayerSymbol;
  nickname: string;
}

export interface GameNode {
  roomId?: string;
  board: PlayerSymbol[];
  status: GameStatus;
  winner: number; // -2: DRAW, -1: NONE, 0/1: PLAYER_INDEX
  currentTurn: number;
  history: MoveNode[];
}

export interface GameStateTree {
  game: GameNode;
  players: PlayerNode[];
}

/**
 * @deprecated Use GameStateTree instead
 */
export interface GameStateSnapshot {
  board: Array<string>;
  winner: number;
  status: string;
  players: Array<string>;
  currentTurn: number;
}
