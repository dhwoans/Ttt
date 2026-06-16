import "animate.css";

import { useRoomStore } from "@/stores/useRoomStore";
import { useGameStore } from "@/stores/useGameStore";
import { CharacterAvatar } from "@ttt/ui";

export default function Players() {
  const playerInfos = useRoomStore((state) => state.playersInfos);
  const tree = useGameStore((state) => state.tree);

  const currentPlayerId =
    tree.players.length > 0
      ? tree.players[tree.game.currentTurn % tree.players.length]?.id
      : null;

  return (
    <ol className="flex flex-row md:flex-col gap-10 md:gap-6">
      {playerInfos.map((player, index) => {
        const animClass =
          player.userId === currentPlayerId
            ? "animate__animated animate__bounce animate__infinite"
            : "";
        return (
          <li key={index} className={`flex flex-col items-center gap-1 `}>
            <div className={animClass}>
              <CharacterAvatar size="small">{player.avatar}</CharacterAvatar>
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
