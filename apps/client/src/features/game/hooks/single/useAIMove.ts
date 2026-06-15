import { useEffect } from "react";
import { ticTacToeAI } from "@/shared/utils/AIPlayer";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";

/**
 * AI의 자동 이동을 처리하는 훅
 */
export function useAIMove(isPlayerTurn: boolean) {
  const tree = useGameStore((state) => state.tree);
  const isGameOver = tree.game.status === "GAME_OVER";
  const dispatch = useGameStore((state) => state.dispatch);
  const playersInfos = useRoomStore((state) => state.playersInfos);

  useEffect(() => {
    if (isGameOver || isPlayerTurn) {
      return;
    }

    const aiTimer = setTimeout(() => {
      if (!playersInfos[0] || !playersInfos[1]) return;
      const playerSymbol = playersInfos[0].avatar;
      const botSymbol = playersInfos[1].avatar;
      
      const aiMoveIndex = ticTacToeAI.getBestMove(tree.game.history, botSymbol, playerSymbol);

      if (aiMoveIndex !== null) {
        dispatch({
          type: "MOVE",
          move: aiMoveIndex,
          symbol: botSymbol,
          nickname: playersInfos[1].nickname,
        });
      }
    }, 1000);

    return () => clearTimeout(aiTimer);
  }, [isPlayerTurn, isGameOver, tree.game.history, playersInfos, dispatch]);
}
