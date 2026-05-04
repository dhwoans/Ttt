import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { eventManager } from "@/shared/utils/EventManager";
import { clearGameSession } from "@/shared/utils/playerStorage";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import type { PlayerLeftEvent, LeaveSuccessEvent } from "@share";

/**
 * 플레이어 퇴장 이벤트 수신 처리
 * - PLAYER_LEFT: 다른 플레이어 퇴장
 * - LEAVE_SUCCESS: 본인 퇴장 성공
 */
export function useReceivePlayerLeave(
  setPlayersReadyStatus: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >,
) {
  const navigate = useNavigate();
  const resetGame = useTicTacToeGameStore((state) => state.resetGame);
  const removePlayerInfo = useTicTacToeGameStore(
    (state) => state.removePlayerInfo,
  );
  const status = useTicTacToeGameStore((state) => state.gameState.status);

  // PLAYER_LEFT 이벤트 처리 (상대 플레이어 퇴장)
  useEffect(() => {
    const handlePlayerLeft = (data: PlayerLeftEvent) => {
      console.log(`[room] ${data.nickname}님이 나갔습니다`);
      toast.warning(`${data.nickname}님이 게임을 나갔습니다.`);

      // 상대 플레이어 정보 제거
      removePlayerInfo(data.nickname);

      // 준비 상태 제거
      setPlayersReadyStatus((prev) => {
        const next = { ...prev };
        delete next[data.connId];
        return next;
      });

      // 게임 중이면 준비상태로 돌아가기로 구현 예정
      // 임시로 로비로 퇴장
      if (status === "PLAYING") {
        setTimeout(() => {
          resetGame();
          clearGameSession();
          navigate("/lobby", { replace: true });
        }, 1500);
      }
    };

    eventManager.on("PLAYER_LEFT", handlePlayerLeft);
    return () => {
      console.log("[room] PLAYER_LEFT 리스너 제거");
      eventManager.off("PLAYER_LEFT", handlePlayerLeft);
    };
  }, [status, removePlayerInfo, setPlayersReadyStatus, navigate, resetGame]);

  // LEAVE_SUCCESS 이벤트 처리 (본인 퇴장 성공)
  useEffect(() => {
    const handleLeaveSuccess = (data: LeaveSuccessEvent) => {
      if (data.success) {
        console.log("[room] 방 나가기 성공");
        resetGame();
        clearGameSession();
        navigate("/lobby", { replace: true });
      }
    };

    eventManager.once("LEAVE_SUCCESS", handleLeaveSuccess);
    return () => {
      // cleanup
    };
  }, [navigate, resetGame]);
}
