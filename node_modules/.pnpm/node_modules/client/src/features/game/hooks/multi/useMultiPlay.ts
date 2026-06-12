import { useSendPlayerReady } from "./useSendPlayerReady";
import { useMultiplayerPlayers } from "./useMultiplayerPlayers";
import { useReceivePlayerReady } from "./useReceivePlayerReady";
import { useReceivePlayerLeave } from "./useReceivePlayerLeave";
import { useReadyTimeoutHandler } from "./useReadyTimeoutHandler";
import { useGamePhaseEvents } from "./useGamePhaseEvents";


export function useMultiPlay() {
  const { sendReady } = useSendPlayerReady();
  

  useGamePhaseEvents();
  useMultiplayerPlayers();
  useReceivePlayerReady();
  useReceivePlayerLeave();
  useReadyTimeoutHandler();

  const handleReady = (isReady: boolean) => {
    console.log("[room] handleReady 호출, isReady:", isReady);
    sendReady(isReady);
  };

  return { handleReady };
}
