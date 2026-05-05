import { useCallback, useMemo } from "react";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { gameSocketManager } from "@/shared/utils/SocketManager";
import type { UseMultiNextTurnConfig } from "../../types/GameHookTypes";
import { useSendPlayerMove } from "./useSendPlayerMove";

export function useMultiNextTurn({
  currentTurnPlayerId,
  isGameOver,
}: UseMultiNextTurnConfig) {
  const { sendMove } = useSendPlayerMove();
  const currentUserId = useTicTacToeGameStore(
    (state) => state.myPlayer?.userId,
  );
  const socketId = useTicTacToeGameStore((state) => state.socketId);

  const isCurrentUserTurnByServer = useMemo(() => {
    const socketConnId = socketId ?? gameSocketManager.getSocket()?.id ?? null;
    return (
      !!currentTurnPlayerId &&
      (currentTurnPlayerId === currentUserId ||
        currentTurnPlayerId === socketConnId)
    );
  }, [currentTurnPlayerId, currentUserId, socketId]);

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
