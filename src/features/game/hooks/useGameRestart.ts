import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import type { GameRestartConfig } from "../types/GameHookTypes";

/**
 * 게임 재시작 처리 훅
 * - phase를 ready로 변경
 * - localStorage 제거
 * - zustand store 초기화
 * - 자동 준비 처리 (싱글: handleReady, 멀티: sendReady)
 */
export function useGameRestart(config: GameRestartConfig) {
  const resetGame = useTicTacToeGameStore((state) => state.resetGame);

  const handleRestart = () => {
    // 게임 종료 후 다시하기는 준비 화면으로 돌아가서 다시 ready를 받는다.
    config.setPhase("ready");
    
    // 남아있는 로컬 상태 정리
    localStorage.removeItem("gameState");
    sessionStorage.removeItem("currentTurnPlayerId");
    // (isWaitingForServer 등은 Playing 컴포넌트가 언마운트되면 사라지므로 별도 처리는 필요 없음)

    // zustand 스토어 초기화
    resetGame();

    // 페이지가 선택한 준비 동작을 즉시 실행
    setTimeout(() => {
      config.triggerReady();
    }, 0);
  };

  return { handleRestart };
}
