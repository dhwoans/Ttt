import { useCallback, useEffect } from "react";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useModalStore } from "@/stores/useModalStore";
import { useSingleNextTurn } from "./useSingleNextTurn";

import { gameTimerService } from "@/shared/services/GameTimerService";

export function useSingleTicTacToe() {
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const setWinner = useGameStore((state) => state.setWinner);

  const tree = useGameStore((state) => state.tree);
  const turnStartTime = useGameStore((state) => state.turnStartTime);
  const playersInfos = useRoomStore((state) => state.playersInfos);

  const { board, status, winner: winnerIndex, history: moveHistory } = tree.game;
  const isGameOver = status === "GAME_OVER";
  const isDraw = winnerIndex === -2;
  
  const winner = winnerIndex >= 0 ? (playersInfos[winnerIndex]?.nickname ?? null) : null;
  const currentPlayer = playersInfos[tree.game.currentTurn % 2] ?? playersInfos[0];
  const isPlayerTurn = currentPlayer?.nickname === playersInfos[0]?.nickname;

  // 턴 시작 시 타임아웃 타이머 가동 (React 외부 서비스)
  useEffect(() => {
    if (!isGameOver && currentPlayer) {
      gameTimerService.start(10000, () => {
        gameTimerService.handleSinglePlayerTimeout(currentPlayer.nickname);
      });
    }

    return () => gameTimerService.stop();
  }, [tree.game.currentTurn, isGameOver, currentPlayer]);

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
    isDraw,
    winner,
    countdownDurationMs: 10000,
    countdownStartTime: turnStartTime,
  };
}
