import { useEffect } from "react";
import { ticTacToeAI } from "@/shared/utils/AIPlayer";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";

/**
 * AI의 자동 이동을 처리하는 훅
 */
export function useAIMove(
  isPlayerTurn: boolean,
  board: string[][],
) {
  const gameState = useGameStore((state) => state.gameState.status);
  const isGameOver = gameState === "FINISHED";
  const addMove = useGameStore((state) => state.addMove);
  const playersInfos = useRoomStore((state) => state.playersInfos);

  useEffect(() => {
    if (isGameOver || isPlayerTurn) {
      return;
    }

    const aiTimer = setTimeout(() => {
      if (!playersInfos[0] || !playersInfos[1]) return;
      const playerSymbol = playersInfos[0].avatar;
      const botSymbol = playersInfos[1].avatar;
      const aiMove = ticTacToeAI.getBestMove(board, botSymbol, playerSymbol);

      if (aiMove) {
        addMove({
          square: { row: aiMove.row, col: aiMove.col },
          symbol: botSymbol,
          nickname: playersInfos[1].nickname,
        });
      }
    }, 1000);

    return () => clearTimeout(aiTimer);
  }, [isPlayerTurn, isGameOver, board, playersInfos, addMove]);
}
