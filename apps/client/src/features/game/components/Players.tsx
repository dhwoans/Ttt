import "animate.css";

import { useRoomStore } from "@/stores/useRoomStore";
import { useGameStore } from "@/stores/useGameStore";
import { CharaterAvatar } from "@/components/ui/CharaterAvatar";

export default function Players() {
  const playerInfos = useRoomStore.getState().playersInfos; // 매번 받아올 필요 없음
  const moveHistory = useGameStore.getState().moveHistory;
  const currentPlayer = playerInfos[moveHistory.length % 2].userId;

  console.log("currentTurnUserId : ", playerInfos);
  return (
    <ol className="flex flex-row md:flex-col gap-10 md:gap-6">
      {playerInfos.map((player, index) => {
        const animClass =
          player.userId === currentPlayer
            ? "animate__animated animate__bounce animate__infinite"
            : "";
        return (
          <li key={index} className={`flex flex-col items-center gap-1 `}>
            <div className={animClass}>
              <CharaterAvatar size="small">{player.avatar}</CharaterAvatar>
            </div>
            <p className="text-sm font-semibold text-white">
              {player.nickname}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
