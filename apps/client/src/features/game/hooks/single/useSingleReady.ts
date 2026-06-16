import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";

export function useSingleReady() {
  const navigate = useNavigate();
  const bridgeTimerRef = useRef<number | null>(null);
  const resetGame = useGameStore((state) => state.resetGame);
  const dispatch = useGameStore((state) => state.dispatch);
  const setTree = useGameStore((state) => state.setTree);

  const handleExit = () => {
    if (bridgeTimerRef.current) clearTimeout(bridgeTimerRef.current);
    resetGame();
    navigate("/lobby", { replace: true });
  };

  const handleReady = (isReady: boolean) => {
    if (!isReady) return;

    // 게임 시작 (스토어의 dispatch가 내부적으로 플레이어 목록을 동기화하고 첫 턴을 랜덤으로 결정합니다)
    dispatch({
      type: "START",
      nickname: "system",
      userId: "system",
    });
  };

  useEffect(() => {
    return () => {
      if (bridgeTimerRef.current) clearTimeout(bridgeTimerRef.current);
    };
  }, []);

  return { handleReady, handleExit };
}
