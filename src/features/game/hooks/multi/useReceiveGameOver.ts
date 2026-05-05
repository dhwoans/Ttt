import { useEffect } from "react";
import { eventManager } from "@/shared/utils/EventManager";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import type { GameOverEvent } from "@share";

/**
 * GAME_OVER 이벤트 수신 훅
 * - 게임 종료 이벤트 처리
 * - gameStore의 status, result, winner 업데이트
 */
export function useReceiveGameOver() {
  const setStatus = useTicTacToeGameStore((state) => state.setStatus);
  const setResult = useTicTacToeGameStore((state) => state.setResult);
  const setWinner = useTicTacToeGameStore((state) => state.setWinner);

  useEffect(() => {
    const handleGameOver = (data: GameOverEvent) => {
      console.log("[Playing] GAME_OVER 수신:", data);

      // 게임 상태를 FINISHED로 변경
      setStatus("FINISHED");
      // 게임 결과 저장
      setResult(data.result);
      // 승자 설정 (무승부 시 null)
      setWinner(data.winner);
    };

    eventManager.on("GAME_OVER", handleGameOver);
    return () => {
      eventManager.off("GAME_OVER", handleGameOver);
    };
  }, [setStatus, setResult, setWinner]);
}
