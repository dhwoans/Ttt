import { useCallback, useMemo } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { gameSocketManager } from "@/shared/services/SocketManager";
import { useSendPlayerMove } from "./useSendPlayerMove";

interface UseMultiNextTurnConfig {
  currentTurnPlayerId: string | null;
  isGameOver: boolean;
}

export function useMultiNextTurn({
  currentTurnPlayerId,
  isGameOver,
}: UseMultiNextTurnConfig) {
  const { sendMove } = useSendPlayerMove();
  const currentUserId = useUserStore((state) => state.currentUser?.userId);
  const socketId = useRoomStore((state) => state.socketId);

  const iscurrentUserTurnByServer = useMemo(() => {
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

      if (isGameOver || !iscurrentUserTurnByServer) {
        console.log("[Playing] 클릭 거부: 내 턴이 아니거나 게임 종료 상태");
        return;
      }

      console.log("[Playing] sendMove 호출:", { row, col });
      sendMove(row, col);
    },
    [isGameOver, iscurrentUserTurnByServer, sendMove],
  );

  return { handleSquare, iscurrentUserTurnByServer };
}
