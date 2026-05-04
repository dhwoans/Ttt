import { useCallback, useMemo } from "react";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { gameSocketManager } from "@/shared/utils/SocketManager";
import type {
  UseMultiNextTurnConfig,
  UseSingleNextTurnConfig,
} from "../types/GameHookTypes";

/**
 * 보드 클릭 처리 훅
 */
import { useSendPlayerMove } from "../hooks/useSendPlayerMove";
import { useAIMove } from "./useAIMove";

export function useSingleNextTurn({
  isPlayerTurn,
  playersInfos,
  moveHistory,
  board,
  isGameOver,
}: UseSingleNextTurnConfig) {
  const addMove = useTicTacToeGameStore((state) => state.addMove);
  useAIMove(isGameOver, isPlayerTurn, board, playersInfos);

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

export function useMultiNextTurn({
  currentTurnPlayerId,
  isGameOver,
}: UseMultiNextTurnConfig) {
  const { sendMove } = useSendPlayerMove();
  const currentUserId = useTicTacToeGameStore(
    (state) => state.myPlayer?.userId,
  );

  const isCurrentUserTurnByServer = useMemo(() => {
    const socketConnId =
      sessionStorage.getItem("socketId") ??
      gameSocketManager.getSocket()?.id ??
      null;

    return (
      !!currentTurnPlayerId &&
      (currentTurnPlayerId === currentUserId ||
        currentTurnPlayerId === socketConnId)
    );
  }, [currentTurnPlayerId, currentUserId]);

  const handleSquare = useCallback(
    (row: number, col: number) => {
      console.log("[Playing] handleSquare 호출:", { row, col });

      if (isGameOver || !isCurrentUserTurnByServer) {
        console.log("[Playing] 클릭 거부: 내 턴이 아니거나 게임 종료 상태");
        return;
      }

      console.log("[Playing] sendMove 호출:", { row, col });
      sendMove(row, col);
    },
    [isGameOver, isCurrentUserTurnByServer, sendMove],
  );

  return { handleSquare, isCurrentUserTurnByServer };
}
