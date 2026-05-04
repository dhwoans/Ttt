import { useEffect } from "react";
import { randomBot } from "@/shared/constants/avatarCandidates";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

export function useSingleInitialBotSetup() {
  const playersInfos = useTicTacToeGameStore((state) => state.playersInfos);
  const setPlayersInfos = useTicTacToeGameStore(
    (state) => state.setPlayersInfos,
  );

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
