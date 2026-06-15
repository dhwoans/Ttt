import { useSendPlayerReady } from "./useSendPlayerReady";
import { useMultiplayerPlayers } from "./useMultiplayerPlayers";
import { useReceivePlayerLeave } from "./useReceivePlayerLeave";
import { useReadyTimeoutHandler } from "./useReadyTimeoutHandler";

export function useMultiPlay() {
  const { sendReady } = useSendPlayerReady();

  useMultiplayerPlayers();
  useReceivePlayerLeave();
  useReadyTimeoutHandler();

  const handleReady = (isReady: boolean) => {
    console.log("[room] handleReady 호출, isReady:", isReady);
    sendReady(isReady);
  };

  return { handleReady };
}
