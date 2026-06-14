import { useCallback } from "react";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useAIMove } from "./useAIMove";

interface UseSingleNextTurnConfig {
  isPlayerTurn: boolean;
  moveHistory: any[];
  board: string[];
  isGameOver: boolean;
}

export function useSingleNextTurn({
  isPlayerTurn,
  board,
}: UseSingleNextTurnConfig) {
  const addMove = useGameStore((state) => state.addMove);
  const tree = useGameStore((state) => state.tree);
  const playerInfos = useRoomStore.getState().playersInfos;
  useAIMove(isPlayerTurn, board);

  const handleSquare = useCallback(
    (row: number, col: number) => {
      console.log("[Playing] handleSquare 호출:", { row, col });
      if (!isPlayerTurn) return;

      const nextPlayer = playerInfos[tree.game.currentTurn % 2];
      if (!nextPlayer) return;
      
      addMove({
        index: row * 3 + col,
        symbol: nextPlayer.avatar as any,
        nickname: nextPlayer.nickname,
      });
    },
    [isPlayerTurn, playerInfos, tree.game.currentTurn, addMove],
  );

  return { handleSquare };
}
