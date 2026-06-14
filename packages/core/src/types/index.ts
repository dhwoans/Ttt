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

export interface GameStateSnapshot {
  board: Array<string>;
  winner: number;
  status: string;
  players: Array<string>;
  currentTurn: number;
}
