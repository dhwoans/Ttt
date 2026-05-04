import { useRoomState } from "../features/game/hooks/useRoomState";
import { useSinglePlay } from "../features/game/hooks/useSinglePlay";
import GameRoomView from "./GameRoomView";
import { SingleTicTacToe } from "./TicTacToe";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

export default function SingleGameRoomPage() {
  const nickname = useTicTacToeGameStore(
    (state) => state.myPlayer?.nickname ?? null,
  );
  const { playersInfos, phase, setPhase } = useRoomState();

  const { handleReady, handleExit } = useSinglePlay({
    setPhase,
  });

  return (
    <GameRoomView
      nickname={nickname}
      phase={phase}
      playersInfos={playersInfos}
      playersReadyStatus={{}}
      onReady={handleReady}
      onExit={handleExit}
      playingView={
        <SingleTicTacToe playersInfos={playersInfos} onExit={handleExit} />
      }
    />
  );
}
