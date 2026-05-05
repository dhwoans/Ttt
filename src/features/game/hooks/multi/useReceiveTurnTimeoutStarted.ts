import { useEffect } from "react";
import { eventManager } from "@/shared/utils/EventManager";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import type { TurnTimeoutStartedEvent } from "@share";

/**
 * TURN_TIMEOUT_STARTED 이벤트 수신 훅
 * - 멀티플레이 착수 제한 시간 시작 시각/지속시간을 서버 이벤트 기준으로 동기화
 */
export function useReceiveTurnTimeoutStarted() {
  const setCurrentTurnUserId = useTicTacToeGameStore(
    (state) => state.setCurrentTurnUserId,
  );
  const turnTimeoutSnapshot = useTicTacToeGameStore(
    (state) => state.turnTimeoutSnapshot,
  );
  const setTurnTimeoutSnapshot = useTicTacToeGameStore(
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
        setCurrentTurnUserId(data.currentTurnPlayerId);
      }
    };

    eventManager.on("TURN_TIMEOUT_STARTED", handleTurnTimeoutStarted);
    return () => {
      eventManager.off("TURN_TIMEOUT_STARTED", handleTurnTimeoutStarted);
    };
  }, [setCurrentTurnUserId, setTurnTimeoutSnapshot]);

  return {
    turnTimeoutMs: turnTimeoutSnapshot?.timeoutMs,
    turnTimeoutStartedAt: turnTimeoutSnapshot?.startedAt,
  };
}
