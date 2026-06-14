import { useEffect } from "react";
import { ticTacToeAI } from "@/shared/utils/AIPlayer";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { to2D } from "@ttt/core";

/**
 * AI의 자동 이동을 처리하는 훅
 */
export function useAIMove(
  isPlayerTurn: boolean,
  board1D: string[],
) {
  const tree = useGameStore((state) => state.tree);
  const isGameOver = tree.game.status === "GAME_OVER";
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
      
      const board2D = to2D(board1D).map(row => row.map(cell => cell === "" ? null : cell));
      const aiMove = ticTacToeAI.getBestMove(board2D, botSymbol, playerSymbol);

      if (aiMove) {
        addMove({
          index: aiMove.row * 3 + aiMove.col,
          symbol: botSymbol as any,
          nickname: playersInfos[1].nickname,
        });
      }
    }, 1000);

    return () => clearTimeout(aiTimer);
  }, [isPlayerTurn, isGameOver, board1D, playersInfos, addMove]);
}
