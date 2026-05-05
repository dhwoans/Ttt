import { useNavigate } from "react-router-dom";
import { useSendPlayerReady } from "./useSendPlayerReady";
import { useSendPlayerLeave } from "./useSendPlayerLeave";
import { useMultiplayerPlayers } from "./useMultiplayerPlayers";
import { useReceivePlayerReady } from "./useReceivePlayerReady";
import { useReceivePlayerLeave } from "./useReceivePlayerLeave";
import { useReadyTimeoutHandler } from "./useReadyTimeoutHandler";
import { useGamePhaseEvents } from "./useGamePhaseEvents";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

export function useMultiPlay() {
  const navigate = useNavigate();
  const { sendReady } = useSendPlayerReady();
  const { sendLeave } = useSendPlayerLeave();
  const resetGame = useTicTacToeGameStore((state) => state.resetGame);
  const playersReadyStatus = useTicTacToeGameStore(
    (state) => state.playersReadyStatus,
  );

  useGamePhaseEvents();
  useMultiplayerPlayers();
  useReceivePlayerReady();
  useReceivePlayerLeave();
  useReadyTimeoutHandler();

  const handleReady = (isReady: boolean) => {
    console.log("[room] handleReady 호출, isReady:", isReady);
    sendReady(isReady);
  };

  const handleExit = () => {
    sendLeave();
    resetGame();
    navigate("/lobby", { replace: true });
  };

  return { handleReady, handleExit, playersReadyStatus, sendReady };
}
