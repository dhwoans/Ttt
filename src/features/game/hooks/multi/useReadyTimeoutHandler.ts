import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eventManager } from "@/shared/services/EventManager";
import { useGameStore } from "@/stores/useGameStore";
import { useUserStore } from "@/stores/useUserStore";
import {useRoomStore} from "@/stores/useRoomStore";
import type { ReadyTimeoutExpiredEvent } from "@contract";

/**
 * READY 타임아웃 이벤트 처리
 * - READY_TIMEOUT_EXPIRED: 타임아웃으로 인한 강제 로비 이동
 */
export function useReadyTimeoutHandler() {
  const navigate = useNavigate();
  const resetGame = useGameStore((state) => state.resetGame);
  const clearGameServerConnection = useRoomStore(
    (state) => state.clearGameServerConnection,
  );
  const setReadyTimeoutSnapshot = useRoomStore(
    (state) => state.setReadyTimeoutSnapshot,
  );
  const currentUserId = useUserStore((state) => state.currentUser?.userId);

  // READY_TIMEOUT_EXPIRED: 타임아웃 만료로 인한 강제 로비 이동
  useEffect(() => {
    const handleReadyTimeoutExpired = (data: ReadyTimeoutExpiredEvent) => {
      console.log("[room] READY_TIMEOUT_EXPIRED 수신:", data);

      // 현재 사용자가 타임아웃된 플레이어인 경우
      if (data.connId === currentUserId) {
        console.log("[room] 현재 사용자가 준비 타임아웃으로 제거됨");

        // 로비로 이동
        setTimeout(() => {
          clearGameServerConnection();
          setReadyTimeoutSnapshot(null);
          resetGame();
          localStorage.removeItem("gameState");
          navigate("/lobby", { replace: true });
        }, 1500);
      } else {
        // 다른 플레이어가 제거된 경우
        console.log(
          "[room] 다른 플레이어가 준비 타임아웃으로 제거됨:",
          data.connId,
        );
      }
    };

    eventManager.on("READY_TIMEOUT_EXPIRED", handleReadyTimeoutExpired);
    return () => {
      console.log("[room] READY_TIMEOUT_EXPIRED 리스너 제거");
      eventManager.off("READY_TIMEOUT_EXPIRED", handleReadyTimeoutExpired);
    };
  }, [
    clearGameServerConnection,
    currentUserId,
    navigate,
    resetGame,
    setReadyTimeoutSnapshot,
  ]);
}
