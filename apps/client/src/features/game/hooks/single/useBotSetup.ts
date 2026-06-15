import { useEffect } from "react";
import { randomBot } from "@/shared/constants/avatarCandidates";
import { useRoomStore } from "@/stores/useRoomStore";

export function useBotSetup() {
  const playersInfos = useRoomStore((state) => state.playersInfos);
  const addPlayerInfo = useRoomStore((state) => state.addPlayerInfo);

  useEffect(() => {
    // 플레이어가 나 혼자일 때만 무작위 봇을 추가
    if (playersInfos.length === 1) {
      const botData = randomBot();

      addPlayerInfo({
        nickname: botData[1],
        avatar: botData[0],
        imageSrc: botData[2],
        isReady: true,
        userId: "bot-id", // 봇 식별용 고정 ID
      });
    }
  }, [playersInfos.length, addPlayerInfo]);
}
