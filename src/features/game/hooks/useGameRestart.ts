import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import type { GameRestartConfig } from "../types/GameHookTypes";

/**
 * 게임 재시작 처리 훅
 * - phase를 ready로 변경
 * - zustand store 초기화
 * - 자동 준비 처리 (싱글: handleReady, 멀티: sendReady)
 */
export function useGameRestart(config: GameRestartConfig) {
  const resetGame = useTicTacToeGameStore((state) => state.resetGame);

  const handleRestart = () => {
    // zustand 스토어 초기화
    resetGame();

    // 페이지가 선택한 준비 동작을 즉시 실행
    setTimeout(() => {
      config.triggerReady();
    }, 0);
  };

  return { handleRestart };
}
