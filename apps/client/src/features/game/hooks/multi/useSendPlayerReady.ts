import { gameSocketManager } from "@/shared/services/SocketManager";
import type { ReadyEventPayload } from "@ttt/contract";
import { useCallback } from "react";
import { useUserStore } from "@/stores/useUserStore";

/**
 * Ready 상태를 서버에 전송하는 훅
 *
 * 서버 이벤트:
 * - PLAYER_READY: 모든 플레이어에게 준비 상태 변경 알림 (GameRoomPage에서 처리)
 */
export function useSendPlayerReady() {
  const userId = useUserStore((state) => state.currentUser?.userId);

  const sendReady = useCallback(
    (isReady: boolean) => {
      if (!userId) {
        console.error("[ready] 필수 정보 없음", { userId });
        return;
      }

      const payload: ReadyEventPayload = { isReady };
      console.log(`[ready] READY ${isReady ? "준비" : "취소"} 전송:`, payload);
      gameSocketManager.sendMessage("READY", payload);
    },
    [userId],
  );

  return { sendReady };
}
