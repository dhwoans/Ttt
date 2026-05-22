import { useCallback, useEffect } from "react";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useModalStore } from "@/stores/useModalStore";
import { useMultiNextTurn } from "./useMultiNextTurn";
import { useReceiveMoveMade } from "./useReceiveMoveMade";
import { useReceiveGameOver } from "./useReceiveGameOver";
import { useReceiveNextTurn } from "./useReceiveNextTurn";
import { useReceiveTurnTimeoutStarted } from "./useReceiveTurnTimeoutStarted";

interface UseMultiTicTacToeProps {
  onExit?: () => void;
}

export function useMultiTicTacToe({ onExit }: UseMultiTicTacToeProps) {
  const gameStatus = useGameStore((state) => state.gameState.status);
  const winner = useGameStore((state) => state.gameState.winner);
  const result = useGameStore((state) => state.gameState.result);
  const playersInfos = useRoomStore((state) => state.playersInfos);
  const currentTurnUserId = useGameStore(
    (state) => state.gameState.turn.currentUserId,
  );
  const isWaitingForServer = useRoomStore((state) => state.isWaitingForServer);
  const openModal = useModalStore((state) => state.openModal);
  const setOpenModal = useModalStore((state) => state.setOpenModal);

  const handleExitIntent = useCallback(() => {
    setOpenModal("exit");
  }, [setOpenModal]);
  useBackExitModal(handleExitIntent, true);

  const handleExitCancel = () => setOpenModal(null);
  const handleExit = () => {
    onExit?.();
  };

  useReceiveMoveMade();
  useReceiveGameOver();
  useReceiveNextTurn();
  const { turnTimeoutMs, turnTimeoutStartedAt } =
    useReceiveTurnTimeoutStarted();

  const isGameOver = gameStatus === "FINISHED";
  const isDraw = result === "draw";
  const currentPlayer = currentTurnUserId
    ? (playersInfos.find((p) => p.userId === currentTurnUserId) ??
      playersInfos[0])
    : (playersInfos[0] ?? null);

  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => setOpenModal("gameOver"), 3000);
      return () => clearTimeout(timer);
    }
  }, [isGameOver, setOpenModal]);

  const { handleSquare, isCurrentUserTurnByServer } = useMultiNextTurn({
    currentTurnPlayerId: currentTurnUserId,
    isGameOver,
  });

  return {
    canSelectSquare:
      !isGameOver && isCurrentUserTurnByServer && !isWaitingForServer,
    handleSquare,
    isGameOver,
    isDraw,
    currentTurnNickname: !isGameOver ? (currentPlayer?.nickname ?? "") : "",
    handleExitCancel,
    handleExit,
    winner,
    countdownDurationMs: turnTimeoutMs ?? 10000,
    countdownStartTime: turnTimeoutStartedAt ?? Date.now(),
  };
}
