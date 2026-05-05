import { useEffect } from "react";
import { eventManager } from "@/shared/utils/EventManager";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import type { PlayerReadyEvent } from "@share";

export function useReceivePlayerReady() {
  const updatePlayerReadyStatus = useTicTacToeGameStore(
    (state) => state.updatePlayerReadyStatus,
  );

  useEffect(() => {
    const handlePlayerReady = (data: PlayerReadyEvent) => {
      console.log(`[room] PLAYER_READY 수신:`, data);
      console.log(
        `[room] ${data.nickname}님이 ${data.isReady ? "준비완료" : "준비취소"}`,
      );
      updatePlayerReadyStatus(data.connId, data.isReady);
    };

    eventManager.on("PLAYER_READY", handlePlayerReady);
    return () => {
      console.log("[room] PLAYER_READY 리스너 제거");
      eventManager.off("PLAYER_READY", handlePlayerReady);
    };
  }, [updatePlayerReadyStatus]);
}
