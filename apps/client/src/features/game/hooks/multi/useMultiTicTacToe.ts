import { useEffect } from "react";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useModalStore } from "@/stores/useModalStore";
import { useMultiNextTurn } from "./useMultiNextTurn";

export function useMultiTicTacToe() {
  const tree = useGameStore((state) => state.tree);
  const serverTurnTimer = useGameStore((state) => state.serverTurnTimer);
  const playersInfos = useRoomStore((state) => state.playersInfos);
  const isWaitingForServer = useRoomStore((state) => state.isWaitingForServer);
  const setOpenModal = useModalStore((state) => state.setOpenModal);

  const gameStatus = tree.game.status;
  const winnerIndex = tree.game.winner;
  const isGameOver = gameStatus === "GAME_OVER";
  const isDraw = winnerIndex === -2;

  const currentTurnUserId =
    tree.players.length > 0
      ? tree.players[tree.game.currentTurn % tree.players.length]?.id
      : "";

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

  const { handleSquare, iscurrentUserTurnByServer } = useMultiNextTurn({
    currentTurnPlayerId: currentTurnUserId,
    isGameOver,
  });

  return {
    canSelectSquare:
      !isGameOver && iscurrentUserTurnByServer && !isWaitingForServer,
    handleSquare,
    isGameOver,
    isDraw,
    currentTurnNickname: !isGameOver ? (currentPlayer?.nickname ?? "") : "",
    winner: winnerIndex >= 0 ? playersInfos[winnerIndex]?.nickname : null,
    countdownDurationMs: serverTurnTimer?.timeoutMs ?? 10000,
    countdownStartTime: serverTurnTimer?.startedAt ?? Date.now(),
  };
}
