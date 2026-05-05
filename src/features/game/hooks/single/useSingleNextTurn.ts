import { useCallback } from "react";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import type { UseSingleNextTurnConfig } from "../../types/GameHookTypes";
import { useAIMove } from "./useAIMove";

export function useSingleNextTurn({
  isPlayerTurn,
  moveHistory,
  board,
  isGameOver,
}: UseSingleNextTurnConfig) {
  const addMove = useTicTacToeGameStore((state) => state.addMove);
  const playersInfos = useTicTacToeGameStore((state) => state.playersInfos);
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
