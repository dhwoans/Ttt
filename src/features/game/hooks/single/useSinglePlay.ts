import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { useSingleInitialBotSetup } from "./useSingleInitialBotSetup";

const preprocessGameStart = (botInfo: unknown[]) => {
  localStorage.setItem(
    "gameState",
    JSON.stringify({
      phase: "playing",
      bot: botInfo,
      turnStart: Date.now(),
      moveHistory: [],
      timeoutBy: null,
    }),
  );
};

export function useSinglePlay() {
  const navigate = useNavigate();
  const bridgeTimerRef = useRef<number | null>(null);
  const resetGameBoard = useTicTacToeGameStore((state) => state.resetGameBoard);
  const setStatus = useTicTacToeGameStore((state) => state.setStatus);
  const playersInfos = useTicTacToeGameStore((state) => state.playersInfos);

  useSingleInitialBotSetup();

  useEffect(() => {
    return () => {
      if (bridgeTimerRef.current) clearTimeout(bridgeTimerRef.current);
    };
  }, []);

  const handleReady = (isReady: boolean) => {
    if (isReady) {
      const bot = playersInfos[1];
      const botInfo = [bot?.avatar, bot?.nickname, bot?.imageSrc];
      resetGameBoard();
      preprocessGameStart(botInfo);
      setStatus("PLAYING");
    }
  };

  const handleExit = () => {
    if (bridgeTimerRef.current) clearTimeout(bridgeTimerRef.current);
    resetGameBoard();
    localStorage.removeItem("gameState");
    navigate("/lobby", { replace: true });
  };

  return { handleReady, handleExit };
}
