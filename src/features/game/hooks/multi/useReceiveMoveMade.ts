import { useEffect } from "react";
import { eventManager } from "@/shared/utils/EventManager";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";
import type { MoveMadeEvent } from "@share";

/**
 * MOVE_MADE 이벤트 수신 훅
 * - 누군가 수를 놨을 때 모두에게 브로드캐스트됨
 * - 대기 상태 해제, turn 추가
 */
export function useReceiveMoveMade() {
  const addMove = useGameStore((state) => state.addMove);
  const setIsWaitingForServer = useRoomStore(
    (state) => state.setIsWaitingForServer,
  );
  const playersInfos = useRoomStore((state) => state.playersInfos);

  useEffect(() => {
    const handleMoveMade = (data: MoveMadeEvent) => {
      console.log("[Playing] MOVE_MADE 수신:", data);
      const { connId, move, isAuto } = data;

      if (isAuto) {
        console.log("[Playing] 서버 자동 착수(MOVE_MADE.isAuto=true)");
      }

      // 대기 상태 해제
      setIsWaitingForServer(false);

      // connId로 플레이어 찾기
      const player = playersInfos.find((p) => p.userId === connId);
      if (!player) {
        console.warn("[Playing] MOVE_MADE: 플레이어를 찾을 수 없음", connId);
        return;
      }

      // 보드 인덱스를 행/열로 변환
      const row = Math.floor(move / 3);
      const col = move % 3;

      // 보드에는 플레이어 아바타(이모지)를 그대로 표시
      const symbol = player.avatar;

      // store에 move 추가 (보드 상태 업데이트)
      addMove({
        square: { row, col },
        symbol,
        nickname: player.nickname,
      });

      console.log("[Playing] turn 추가됨:", {
        row,
        col,
        symbol,
        nickname: player.nickname,
      });
    };

    eventManager.on("MOVE_MADE", handleMoveMade);
    return () => {
      eventManager.off("MOVE_MADE", handleMoveMade);
    };
  }, [playersInfos, addMove, setIsWaitingForServer]);
}
