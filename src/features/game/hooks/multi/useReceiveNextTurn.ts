import { useEffect } from "react";
import { eventManager } from "@/shared/services/EventManager";
import { useGameStore } from "@/stores/useGameStore";
import type { NextTurnEvent } from "@contract";

/**
 * NEXT_TURN 이벤트 수신 훅
 * - store의 currentTurnUserId 업데이트
 */
export function useReceiveNextTurn() {
  const setCurrentTurnUserId = useGameStore(
    (state) => state.setCurrentTurnUserId,
  );

  useEffect(() => {
    const handleNextTurn = (data: NextTurnEvent) => {
      if (data.nextPlayerId) {
        setCurrentTurnUserId(data.nextPlayerId);
      }
    };

    eventManager.on("NEXT_TURN", handleNextTurn);
    return () => {
      eventManager.off("NEXT_TURN", handleNextTurn);
    };
  }, [setCurrentTurnUserId]);
}
