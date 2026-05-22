import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { eventManager } from "@/shared/services/EventManager";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";
import type { PlayerLeftEvent, LeaveSuccessEvent } from "@contract";

/**
 * 플레이어 퇴장 이벤트 수신 처리
 * - PLAYER_LEFT: 다른 플레이어 퇴장
 * - LEAVE_SUCCESS: 본인 퇴장 성공
 */
export function useReceivePlayerLeave() {
  const navigate = useNavigate();
  const resetGame = useGameStore((state) => state.resetGame);
  const removePlayerInfo = useRoomStore((state) => state.removePlayerInfo);
  const removePlayerReadyStatus = useRoomStore(
    (state) => state.removePlayerReadyStatus,
  );
  const status = useGameStore((state) => state.gameState.status);

  // PLAYER_LEFT 이벤트 처리 (상대 플레이어 퇴장)
  useEffect(() => {
    const handlePlayerLeft = (data: PlayerLeftEvent) => {
      console.log(`[room] ${data.nickname}님이 나갔습니다`);
      toast.warning(`${data.nickname}님이 게임을 나갔습니다.`);

      removePlayerInfo(data.nickname);
      removePlayerReadyStatus(data.connId);

      if (status === "PLAYING") {
        setTimeout(() => {
          resetGame();
          navigate("/lobby", { replace: true });
        }, 1500);
      }
    };

    eventManager.on("PLAYER_LEFT", handlePlayerLeft);
    return () => {
      console.log("[room] PLAYER_LEFT 리스너 제거");
      eventManager.off("PLAYER_LEFT", handlePlayerLeft);
    };
  }, [status, removePlayerInfo, removePlayerReadyStatus, navigate, resetGame]);

  // LEAVE_SUCCESS 이벤트 처리 (본인 퇴장 성공)
  useEffect(() => {
    const handleLeaveSuccess = (data: LeaveSuccessEvent) => {
      if (data.success) {
        resetGame();
        navigate("/lobby", { replace: true });
      }
    };

    eventManager.once("LEAVE_SUCCESS", handleLeaveSuccess);
    return () => {
      // cleanup
    };
  }, [navigate, resetGame]);
}
