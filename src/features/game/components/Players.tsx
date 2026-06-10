import "animate.css";
import { Avatar } from "@/components/ui/Avatar";
import { useRoomStore } from "@/stores/useRoomStore";
import { useGameStore } from "@/stores/useGameStore";

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
              <Avatar size="small">{player.avatar}</Avatar>
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
