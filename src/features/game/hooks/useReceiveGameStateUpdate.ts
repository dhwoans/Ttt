import { useEffect } from "react";
import { eventManager } from "@/shared/utils/EventManager";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

/**
 * GAME_STATE_UPDATE 이벤트 수신 훅
 * - 서버에서 모든 플레이어에게 게임 상태 업데이트
 * - currentTurnPlayerId 업데이트
 */
export function useReceiveGameStateUpdate() {
  const setCurrentTurnUserId = useTicTacToeGameStore(
    (state) => state.setCurrentTurnUserId,
  );

  useEffect(() => {
    const handleGameStateUpdate = (data: any) => {
      if (data.currentTurnPlayerId) {
        setCurrentTurnUserId(data.currentTurnPlayerId);
        sessionStorage.setItem("currentTurnPlayerId", data.currentTurnPlayerId);
      }
    };

    eventManager.on("GAME_STATE_UPDATE", handleGameStateUpdate);
    return () => {
      eventManager.off("GAME_STATE_UPDATE", handleGameStateUpdate);
    };
  }, [setCurrentTurnUserId]);
}
