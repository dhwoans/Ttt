import { useCallback, useEffect } from "react";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useModalStore } from "@/stores/useModalStore";
import { calcBoard, whoIsWin } from "@/shared/utils/ticTacToeUtils";
import { useGameTimeout } from "./useGameTimeout";
import { useSingleNextTurn } from "./useSingleNextTurn";
import type { UseTicTacToeProps } from "../../types/GameHookTypes";

export function useSingleTicTacToe({ onExit }: UseTicTacToeProps) {
  const setOpenModal = useModalStore((state) => state.setOpenModal);

  const handleExitIntent = useCallback(() => {
    setOpenModal("exit");
  }, [setOpenModal]);
  useBackExitModal(handleExitIntent, true);

  const handleExitCancel = () => setOpenModal(null);
  const handleExit = () => {
    onExit?.();
  };

  const moveHistory = useGameStore((state) => state.moveHistory);
  const turnStart = useGameStore((state) => state.turnStart);
  const timeoutBy = useGameStore((state) => state.timeoutBy);
  const playersInfos = useRoomStore((state) => state.playersInfos);
  const board = calcBoard(moveHistory);
  const boardWinner = whoIsWin(board, moveHistory);
  const isDraw = moveHistory.length === 9;
  const timeoutWinner = timeoutBy
    ? (playersInfos.find((p) => p.nickname !== timeoutBy)?.nickname ?? null)
    : null;
  const winner = timeoutWinner ?? boardWinner;
  const isGameOver = !!winner || isDraw || !!timeoutBy;
  const currentPlayer = playersInfos[moveHistory.length % 2] ?? playersInfos[0];
  const isPlayerTurn = currentPlayer?.nickname === playersInfos[0]?.nickname;

  const { handleTimeout } = useGameTimeout(currentPlayer?.nickname ?? "");

  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => setOpenModal("gameOver"), 3000);
      return () => clearTimeout(timer);
    }
    setOpenModal(null);
  }, [isGameOver, setOpenModal]);

  const { handleSquare } = useSingleNextTurn({
    isPlayerTurn,
    moveHistory,
    board,
    isGameOver,
  });

  return {
    canSelectSquare: !isGameOver && isPlayerTurn,
    handleSquare,
    isGameOver,
    currentTurnNickname: !isGameOver ? (currentPlayer?.nickname ?? "") : "",
    handleExitCancel,
    handleExit,
    isDraw,
    winner,
    countdownDurationMs: 10000,
    countdownStartTime: turnStart,
    countdownOnComplete: handleTimeout,
  };
}
