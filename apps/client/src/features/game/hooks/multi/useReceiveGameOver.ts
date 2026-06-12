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
  const setStatus = useGameStore((state) => state.setStatus);
  const setResult = useGameStore((state) => state.setResult);
  const setWinner = useGameStore((state) => state.setWinner);
  const playersInfos = useRoomStore((state) => state.playersInfos);

  useEffect(() => {
    const handleGameOver = (data: GameOverEvent) => {
      console.log("[Playing] GAME_OVER 수신:", data);

      // 게임 상태를 FINISHED로 변경
      setStatus("FINISHED");
      // 게임 결과 저장
      setResult(data.result);
      // 멀티 winner는 userId이므로 UI 표시에 맞게 nickname으로 정규화한다.
      const normalizedWinner = data.winner
        ? (playersInfos.find((player) => player.userId === data.winner)
            ?.nickname ?? data.winner)
        : null;
      setWinner(normalizedWinner);
    };

    eventManager.on("GAME_OVER", handleGameOver);
    return () => {
      eventManager.off("GAME_OVER", handleGameOver);
    };
  }, [playersInfos, setStatus, setResult, setWinner]);
}
