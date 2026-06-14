import { useEffect } from "react";
import { eventManager } from "@/shared/services/EventManager";
import { useGameStore } from "@/stores/useGameStore";
import type { PlayingEvent } from "@ttt/contract";

/**
 * 게임 페이즈 관련 이벤트 처리
 * - PLAYING: 게임 시작
 * - ROOM_ASSIGNED: 방 배정
 */
export function useGamePhaseEvents() {
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const setTree = useGameStore((state) => state.setTree);

  // PLAYING 신호 수신 시 phase 변경 및 전처리
  useEffect(() => {
    const handlePlaying = (data: PlayingEvent) => {
      console.log("[room] PLAYING 이벤트 수신, 게임 시작:", data);

      const players = data.players.map((id) => ({ id }));
      const currentTurn = data.players.indexOf(data.currentTurnPlayerId);

      // 게임 상태 및 플레이어 정보 업데이트
      setTree({
        players,
        game: {
          ...useGameStore.getState().tree.game,
          status: "PLAYING",
          currentTurn: currentTurn !== -1 ? currentTurn : 0,
        },
      });

      if (data.currentTurnPlayerId) {
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
  }, [setTree]);

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
