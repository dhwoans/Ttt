import "animate.css";
import { Avatar } from "@/shared/components/Avatar";
import { useRoomStore } from "@/stores/useRoomStore";
import { useGameStore } from "@/stores/useGameStore";

//턴 알림
export default function Players() {
  const playerInfos = useRoomStore((state) => state.playersInfos);
  const currentTurnUserId = useGameStore(
    (state) => state.gameState.turn.currentUserId,
  );

  const currentTurnNickname =
    playerInfos.find((player) => player.userId === currentTurnUserId)
      ?.nickname ?? "";

  return (
    <ol className="flex flex-row md:flex-col gap-10 md:gap-6">
      {playerInfos.map((player, index) => {
        const animClass =
          player.nickname === currentTurnNickname
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
