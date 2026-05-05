import { gameSocketManager } from "@/shared/utils/SocketManager";
import type { LeaveEventPayload } from "@share";
import { useCallback } from "react";

/**
 * 게임 방 나가기를 서버에 알리는 훅
 *
 * 서버 이벤트:
 * - LEAVE_SUCCESS: 본인의 나가기 성공 (GameRoomPage에서 처리)
 * - PLAYER_LEFT: 다른 플레이어들에게 전달되는 플레이어 퇴장 알림 (GameRoomPage에서 처리)
 */
export function useSendPlayerLeave() {
  const sendLeave = useCallback(() => {
    console.log("[leave] 방 나가기 요청");
    const payload: LeaveEventPayload = {};
    gameSocketManager.sendMessage("LEAVE", payload);
  }, []);

  return { sendLeave };
}
