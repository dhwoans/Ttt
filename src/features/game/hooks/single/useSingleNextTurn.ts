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
  isGameOver,
}: UseSingleNextTurnConfig) {
  const addMove = useGameStore((state) => state.addMove);
  const playersInfos = useRoomStore((state) => state.playersInfos);
  useAIMove(isGameOver, isPlayerTurn, board);

  const handleSquare = useCallback(
    (row: number, col: number) => {
      console.log("[Playing] handleSquare 호출:", { row, col });
      if (!isPlayerTurn) return;

      const nextPlayer = playersInfos[moveHistory.length % 2];
      if (!nextPlayer) return;
      addMove({
        square: { row, col },
        symbol: nextPlayer.avatar,
        nickname: nextPlayer.nickname,
      });
    },
    [isPlayerTurn, playersInfos, moveHistory, addMove],
  );

  return { handleSquare };
}
