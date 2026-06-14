import { useEffect } from "react";
import { eventManager } from "@/shared/services/EventManager";
import { useGameStore } from "@/stores/useGameStore";
import type { TurnTimeoutStartedEvent } from "@ttt/contract";

/**
 * TURN_TIMEOUT_STARTED 이벤트 수신 훅
 * - 멀티플레이 착수 제한 시간 시작 시각/지속시간을 서버 이벤트 기준으로 동기화
 */
export function useReceiveTurnTimeoutStarted() {
  const setTree = useGameStore((state) => state.setTree);
  const turnTimeoutSnapshot = useGameStore(
    (state) => state.turnTimeoutSnapshot,
  );
  const setTurnTimeoutSnapshot = useGameStore(
    (state) => state.setTurnTimeoutSnapshot,
  );

  useEffect(() => {
    const handleTurnTimeoutStarted = (data: TurnTimeoutStartedEvent) => {
      const timeoutMs = Number(data.timeoutMs);
      if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
        return;
      }

      const nextSnapshot = { timeoutMs, startedAt: Date.now() };
      setTurnTimeoutSnapshot(nextSnapshot);

      if (data.currentTurnPlayerId) {
        const tree = useGameStore.getState().tree;
        const index = tree.players.findIndex(p => p.id === data.currentTurnPlayerId);
        if (index !== -1) {
          setTree({
            game: {
              ...tree.game,
              currentTurn: index
            }
          });
        }
      }
    };

    eventManager.on("TURN_TIMEOUT_STARTED", handleTurnTimeoutStarted);
    return () => {
      eventManager.off("TURN_TIMEOUT_STARTED", handleTurnTimeoutStarted);
    };
  }, [setTree, setTurnTimeoutSnapshot]);

  return {
    turnTimeoutMs: turnTimeoutSnapshot?.timeoutMs,
    turnTimeoutStartedAt: turnTimeoutSnapshot?.startedAt,
  };
}
