import { useCallback, useEffect } from "react";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useModalStore } from "@/stores/useModalStore";
import { useAIMove } from "./useAIMove";
import { gameTimerService } from "@/shared/services/GameTimerService";

export function useSingleTicTacToe() {
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  const dispatch = useGameStore((state) => state.dispatch);

  const tree = useGameStore((state) => state.tree);
  const turnStartTime = useGameStore((state) => state.turnStartTime);
  const playersInfos = useRoomStore((state) => state.playersInfos);

  const { status, winner: winnerIndex } = tree.game;
  const isGameOver = status === "GAME_OVER";
  const isDraw = winnerIndex === -2;

  const winner =
    winnerIndex >= 0 ? (playersInfos[winnerIndex]?.nickname ?? null) : null;

  // 플레이어가 1명 이상인지 확인 후, 0번 인덱스가 항상 유저("나")라고 가정 (봇은 1번)
  const currentPlayer = playersInfos[tree.game.currentTurn % playersInfos.length] ?? playersInfos[0];
  const isPlayerTurn = currentPlayer?.nickname === playersInfos[0]?.nickname;

  // AI 봇 이동 훅
  useAIMove(isPlayerTurn);

  // 턴 시작 시 타임아웃 타이머 가동 
  useEffect(() => {
    if (!isGameOver && currentPlayer) {
      gameTimerService.start(10000, () => {
        gameTimerService.handleSinglePlayerTimeout(currentPlayer.nickname);
      });
    }

    return () => gameTimerService.stop();
  }, [tree.game.currentTurn, isGameOver, currentPlayer]);

  // 게임 종료 모달 처리
  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => setOpenModal("gameOver"), 3000);
      return () => clearTimeout(timer);
    }
    setOpenModal(null);
  }, [isGameOver, setOpenModal]);

  // 사용자의 클릭에 의한 착수 처리
  const handleSquare = useCallback(
    (index: number) => {
      console.log("[Playing] handleSquare 호출:", { index });
      if (!isPlayerTurn || isGameOver) return;

      if (!currentPlayer) return;

      dispatch({
        type: "MOVE",
        move: index,
        symbol: currentPlayer.avatar,
        nickname: currentPlayer.nickname,
      });
    },
    [isPlayerTurn, isGameOver, currentPlayer, dispatch],
  );

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
