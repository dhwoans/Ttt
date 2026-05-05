import { useEffect } from "react";
import { eventManager } from "@/shared/utils/EventManager";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

/**
 * NEXT_TURN 이벤트 수신 훅
 * - store의 currentTurnUserId 업데이트
 */
export function useReceiveNextTurn() {
  const setCurrentTurnUserId = useTicTacToeGameStore(
    (state) => state.setCurrentTurnUserId,
  );

  useEffect(() => {
    const handleNextTurn = (data: any) => {
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
