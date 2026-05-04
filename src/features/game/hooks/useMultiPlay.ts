import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSendPlayerReady } from "./useSendPlayerReady";
import { useSendPlayerLeave } from "./useSendPlayerLeave";
import { useMultiplayerPlayers } from "./useMultiplayerPlayers";
import { useReceivePlayerReady } from "./useReceivePlayerReady";
import { useReceivePlayerLeave } from "./useReceivePlayerLeave";
import { useReadyTimeoutHandler } from "./useReadyTimeoutHandler";
import { useGamePhaseEvents } from "./useGamePhaseEvents";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { clearGameSession } from "@/shared/utils/playerStorage";
import type { UseMultiPlayProps } from "../types/GameHookTypes";

export function useMultiPlay({ phase, setPhase }: UseMultiPlayProps) {
  const navigate = useNavigate();
  const [playersReadyStatus, setPlayersReadyStatus] = useState<
    Record<string, boolean>
  >({});

  const { sendReady } = useSendPlayerReady();
  const { sendLeave } = useSendPlayerLeave();
  const resetGame = useTicTacToeGameStore((state) => state.resetGame);

  useGamePhaseEvents(setPhase);
  //
  useMultiplayerPlayers(setPlayersReadyStatus);
  useReceivePlayerReady(setPlayersReadyStatus);
  useReceivePlayerLeave(setPlayersReadyStatus);
  useReadyTimeoutHandler();

  const handleReady = (isReady: boolean) => {
    console.log("[room] handleReady 호출, isReady:", isReady);
    sendReady(isReady);
  };

  const handleExit = () => {
    sendLeave();
    resetGame();
    clearGameSession();
    navigate("/lobby", { replace: true });
  };

  return { handleReady, handleExit, playersReadyStatus, sendReady };
}
