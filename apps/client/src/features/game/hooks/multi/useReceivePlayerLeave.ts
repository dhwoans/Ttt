import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";

/**
 * 플레이어 퇴장 시 발생하는 사이드 이펙트(네비게이션 등) 처리
 * 이제는 Store의 lastServerEvent를 구독하여 처리함
 */
export function useReceivePlayerLeave() {
  const navigate = useNavigate();
  const resetGame = useGameStore((state) => state.resetGame);
  const clearGameServerConnection = useRoomStore(
    (state) => state.clearGameServerConnection,
  );
  const setReadyTimeoutSnapshot = useRoomStore(
    (state) => state.setReadyTimeoutSnapshot,
  );
  const status = useGameStore((state) => state.tree.game.status);
  const lastServerEvent = useRoomStore((state) => state.lastServerEvent);

  useEffect(() => {
    if (!lastServerEvent) return;

    const { name, data } = lastServerEvent;

    // PLAYER_LEFT: 상대 플레이어 퇴장 시
    if (name === "PLAYER_LEFT") {
      if (status === "PLAYING") {
        setTimeout(() => {
          clearGameServerConnection();
          setReadyTimeoutSnapshot(null);
          resetGame();
          navigate("/lobby", { replace: true });
        }, 1500);
      }
    }

    // LEAVE_SUCCESS: 본인 퇴장 성공 시
    if (name === "LEAVE_SUCCESS" && data.success) {
      clearGameServerConnection();
      setReadyTimeoutSnapshot(null);
      resetGame();
      navigate("/lobby", { replace: true });
    }
  }, [lastServerEvent, status, clearGameServerConnection, navigate, resetGame, setReadyTimeoutSnapshot]);
}
