import { useCallback, useEffect } from "react";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { useMultiNextTurn } from "./useMultiNextTurn";
import { useReceiveMoveMade } from "./useReceiveMoveMade";
import { useReceiveGameOver } from "./useReceiveGameOver";
import { useReceiveNextTurn } from "./useReceiveNextTurn";
import { useReceiveTurnTimeoutStarted } from "./useReceiveTurnTimeoutStarted";
import type { UseTicTacToeProps } from "../../types/GameHookTypes";

export function useMultiTicTacToe({ onExit }: UseTicTacToeProps) {
  const gameStatus = useTicTacToeGameStore((state) => state.gameState.status);
  const winner = useTicTacToeGameStore((state) => state.gameState.winner);
  const result = useTicTacToeGameStore((state) => state.gameState.result);
  const playersInfos = useTicTacToeGameStore((state) => state.playersInfos);
  const currentTurnUserId = useTicTacToeGameStore(
    (state) => state.gameState.turn.currentUserId,
  );
  const isWaitingForServer = useTicTacToeGameStore(
    (state) => state.isWaitingForServer,
  );
  const openModal = useTicTacToeGameStore((state) => state.openModal);
  const setOpenModal = useTicTacToeGameStore((state) => state.setOpenModal);

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
    showExitModal: openModal === "exit",
    showGameOverModal: openModal === "gameOver",
    handleExitCancel,
    handleExit,
    winner,
    countdownDurationMs: turnTimeoutMs ?? 10000,
    countdownStartTime: turnTimeoutStartedAt ?? Date.now(),
  };
}
