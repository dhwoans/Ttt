import { useCallback } from "react";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useAIMove } from "./useAIMove";

interface UseSingleNextTurnConfig {
  isPlayerTurn: boolean;
  moveHistory: any[];
  board: string[][];
  isGameOver: boolean;
}

export function useSingleNextTurn({
  isPlayerTurn,
  moveHistory,
  board,
}: UseSingleNextTurnConfig) {
  const addMove = useGameStore((state) => state.addMove);
  const playerInfos = useRoomStore.getState().playersInfos; // 매번 받아올 필요 없음
  useAIMove( isPlayerTurn, board);

  const handleSquare = useCallback(
    (row: number, col: number) => {
      console.log("[Playing] handleSquare 호출:", { row, col });
      if (!isPlayerTurn) return;

      const nextPlayer = playerInfos[moveHistory.length % 2];
      if (!nextPlayer) return;
      addMove({
        square: { row, col },
        symbol: nextPlayer.avatar,
        nickname: nextPlayer.nickname,
      });
    },
    [isPlayerTurn, playerInfos, moveHistory, addMove],
  );

  return { handleSquare };
}
