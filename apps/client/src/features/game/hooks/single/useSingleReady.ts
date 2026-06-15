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
    
    // 싱글 플레이 시작 전, 로비에 세팅된 유저와 봇 정보를 엔진(State Tree)의 플레이어 목록에 주입
    const playersInfos = useRoomStore.getState().playersInfos;
    setTree({
      players: playersInfos.map(p => ({ id: p.userId || "bot-id" }))
    });

    // 게임 시작
    dispatch({ type: "START", nickname: "system" });
  };

  useEffect(() => {
    return () => {
      if (bridgeTimerRef.current) clearTimeout(bridgeTimerRef.current);
    };
  }, []);

  return { handleReady, handleExit };
}
