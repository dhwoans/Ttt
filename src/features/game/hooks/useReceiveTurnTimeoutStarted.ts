import { useEffect, useState } from "react";
import { eventManager } from "@/shared/utils/EventManager";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import type { TurnTimeoutStartedEvent } from "@share";

const TURN_TIMEOUT_SNAPSHOT_KEY = "turnTimeoutSnapshot";

interface TurnTimeoutSnapshot {
  timeoutMs: number;
  startedAt: number;
}

/**
 * TURN_TIMEOUT_STARTED 이벤트 수신 훅
 * - 멀티플레이 착수 제한 시간 시작 시각/지속시간을 서버 이벤트 기준으로 동기화
 */
export function useReceiveTurnTimeoutStarted() {
  const setCurrentTurnUserId = useTicTacToeGameStore(
    (state) => state.setCurrentTurnUserId,
  );

  const [snapshot, setSnapshot] = useState<TurnTimeoutSnapshot | null>(() => {
    const raw = sessionStorage.getItem(TURN_TIMEOUT_SNAPSHOT_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<TurnTimeoutSnapshot>;
      const timeoutMs = Number(parsed.timeoutMs);
      const startedAt = Number(parsed.startedAt);
      if (
        !Number.isFinite(timeoutMs) ||
        !Number.isFinite(startedAt) ||
        timeoutMs <= 0
      ) {
        sessionStorage.removeItem(TURN_TIMEOUT_SNAPSHOT_KEY);
        return null;
      }

      return { timeoutMs, startedAt };
    } catch {
      sessionStorage.removeItem(TURN_TIMEOUT_SNAPSHOT_KEY);
      return null;
    }
  });

  useEffect(() => {
    const handleTurnTimeoutStarted = (data: TurnTimeoutStartedEvent) => {
      const timeoutMs = Number(data.timeoutMs);
      if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
        return;
      }

      const nextSnapshot = { timeoutMs, startedAt: Date.now() };
      setSnapshot(nextSnapshot);
      sessionStorage.setItem(
        TURN_TIMEOUT_SNAPSHOT_KEY,
        JSON.stringify(nextSnapshot),
      );

      if (data.currentTurnPlayerId) {
        setCurrentTurnUserId(data.currentTurnPlayerId);
        sessionStorage.setItem("currentTurnPlayerId", data.currentTurnPlayerId);
      }
    };

    eventManager.on("TURN_TIMEOUT_STARTED", handleTurnTimeoutStarted);
    return () => {
      eventManager.off("TURN_TIMEOUT_STARTED", handleTurnTimeoutStarted);
    };
  }, [setCurrentTurnUserId]);

  return {
    turnTimeoutMs: snapshot?.timeoutMs,
    turnTimeoutStartedAt: snapshot?.startedAt,
  };
}
