import { useEffect } from "react";
import { eventManager } from "@/shared/services/EventManager";
import { useGameStore } from "@/stores/useGameStore";
import type { NextTurnEvent } from "@ttt/contract";

/**
 * NEXT_TURN 이벤트 수신 훅
 * - store의 currentTurnUserId 업데이트
 */
export function useReceiveNextTurn() {
  const setTree = useGameStore((state) => state.setTree);

  useEffect(() => {
    const handleNextTurn = (data: NextTurnEvent) => {
      setTree({
        game: {
          ...useGameStore.getState().tree.game,
          currentTurn: data.currentTurn,
        },
      });
    };

    eventManager.on("NEXT_TURN", handleNextTurn);
    return () => {
      eventManager.off("NEXT_TURN", handleNextTurn);
    };
  }, [setTree]);
}
