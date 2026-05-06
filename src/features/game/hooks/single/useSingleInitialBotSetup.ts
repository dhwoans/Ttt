import { useEffect } from "react";
import { randomBot } from "@/shared/constants/avatarCandidates";
import { useRoomStore } from "@/stores/useRoomStore";

export function useSingleInitialBotSetup() {
  const playersInfos = useRoomStore((state) => state.playersInfos);
  const setPlayersInfos = useRoomStore((state) => state.setPlayersInfos);

  useEffect(() => {
    if (playersInfos.length !== 1) return;

    const me = playersInfos[0];
    if (!me) return;

    let initialBot: any = undefined;
    const saved = localStorage.getItem("gameState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.bot) initialBot = parsed.bot;
      } catch {}
    }

    const botData = initialBot ?? randomBot();
    setPlayersInfos([
      me,
      {
        nickname: botData[1],
        avatar: botData[0],
        imageSrc: botData[2],
      },
    ]);
  }, [playersInfos, setPlayersInfos]);
}
