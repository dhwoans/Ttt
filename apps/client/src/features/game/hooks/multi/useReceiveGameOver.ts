import { useEffect } from "react";
import { eventManager } from "@/shared/services/EventManager";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";
import type { GameOverEvent } from "@ttt/contract";

/**
 * GAME_OVER 이벤트 수신 훅
 * - 게임 종료 이벤트 처리
 * - gameStore의 status, result, winner 업데이트
 */
export function useReceiveGameOver() {
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const setWinner = useGameStore((state) => state.setWinner);
  const playersInfos = useRoomStore((state) => state.playersInfos);

  useEffect(() => {
    const handleGameOver = (data: GameOverEvent) => {
      console.log("[Playing] GAME_OVER 수신:", data);

      // 게임 상태를 GAME_OVER로 변경
      setGameStatus("GAME_OVER");
      
      // 승자 인덱스 설정 (-2는 무승부)
      if (data.result === "draw") {
        setWinner(-2);
      } else if (data.winnerIndex !== undefined) {
        setWinner(data.winnerIndex);
      } else if (data.winner) {
         // Fallback if winnerIndex missing but winner ID present
         const index = playersInfos.findIndex(p => p.userId === data.winner);
         setWinner(index);
      }
    };

    eventManager.on("GAME_OVER", handleGameOver);
    return () => {
      eventManager.off("GAME_OVER", handleGameOver);
    };
  }, [playersInfos, setGameStatus, setWinner]);
}
