import { useEffect } from "react";
import { eventManager } from "@/shared/utils/EventManager";
import { useGameStore } from "@/stores/useGameStore";
import type { PlayingEvent } from "@/share";

/**
 * 게임 페이즈 관련 이벤트 처리
 * - PLAYING: 게임 시작
 * - ROOM_ASSIGNED: 방 배정
 */
export function useGamePhaseEvents() {
  const setStatus = useGameStore((state) => state.setStatus);
  const setCurrentTurnUserId = useGameStore(
    (state) => state.setCurrentTurnUserId,
  );

  // PLAYING 신호 수신 시 phase 변경 및 전처리
  useEffect(() => {
    const handlePlaying = (data: PlayingEvent) => {
      console.log("[room] PLAYING 이벤트 수신, 게임 시작:", data);
      //게임 상태 변경
      setStatus("PLAYING");

      if (data.currentTurnPlayerId) {
        setCurrentTurnUserId(data.currentTurnPlayerId);
        console.log(
          "[room] PLAYING 이벤트에서 currentTurnPlayerId 저장:",
          data.currentTurnPlayerId,
        );
        eventManager.emit("GAME_STATE_UPDATE", {
          currentTurnPlayerId: data.currentTurnPlayerId,
          roomId: data.roomId,
          status: data.status,
          players: data.players,
        });
      } else {
        console.warn("[room] PLAYING 이벤트에 currentTurnPlayerId 없음:", data);
      }
    };

    eventManager.on("PLAYING", handlePlaying);
    return () => {
      console.log("[room] PLAYING 리스너 제거");
      eventManager.off("PLAYING", handlePlaying);
    };
  }, [setCurrentTurnUserId, setStatus]);

  // 멀티플레이 시작: ROOM_ASSIGNED 수신
  useEffect(() => {
    const handleRoomAssigned = () => {
      console.log("[room] ROOM_ASSIGNED 수신, 멀티플레이 시작 준비");
    };

    eventManager.on("ROOM_ASSIGNED", handleRoomAssigned);
    return () => {
      console.log("[room] ROOM_ASSIGNED 리스너 제거");
      eventManager.off("ROOM_ASSIGNED", handleRoomAssigned);
    };
  }, []);
}
