import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

export interface PlayerInfo {
  nickname: string;
  avatarIndex: number;
}

export function getPlayerInfoFromStore(): PlayerInfo {
  const myPlayer = useTicTacToeGameStore.getState().myPlayer;

  return {
    nickname: myPlayer?.nickname || "플레이어",
    avatarIndex: myPlayer?.avatarIndex ?? 3,
  };
}

export function getUserIdFromStore(): string | null {
  return useTicTacToeGameStore.getState().myPlayer?.userId ?? null;
}

/**
 * 게임 세션 종료 시 관련 상태 초기화
 * 모든 퇴장 경로에 사용
 */
export function clearGameSession() {
  // localStorage
  localStorage.removeItem("gameState");

  // sessionStorage - 게임/방 관련
  sessionStorage.removeItem("roomId");
  sessionStorage.removeItem("socketId");
  sessionStorage.removeItem("currentTurnPlayerId");
  sessionStorage.removeItem("gameServerUrl");
  sessionStorage.removeItem("gameTicket");
  sessionStorage.removeItem("readyTimeoutSnapshot");
  sessionStorage.removeItem("turnTimeoutSnapshot");
}
