import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/stores/useGameStore";


export function useSingleReady() {
  const navigate = useNavigate();
  const bridgeTimerRef = useRef<number | null>(null);
  const resetGame = useGameStore((state) => state.resetGame);
  const setGameStatus = useGameStore((state) => state.setGameStatus);

  const handleExit = () => {
    if (bridgeTimerRef.current) clearTimeout(bridgeTimerRef.current);
    resetGame();
    navigate("/lobby", { replace: true });
  };

  const handleReady = (isReady: boolean) => {
    if (!isReady) return;
    setGameStatus("PLAYING");
  };

  useEffect(() => {
    return () => {
      if (bridgeTimerRef.current) clearTimeout(bridgeTimerRef.current);
    };
  }, []);

  return { handleReady, handleExit };
}
