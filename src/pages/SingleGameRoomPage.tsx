import { useRoomState } from "../features/game/hooks/useRoomState";
import { useSinglePlay } from "../features/game/hooks/single/useSinglePlay";
import GameRoomView from "./GameRoomView";
import { SingleTicTacToe } from "./TicTacToe";

export default function SingleGameRoomPage() {
  useRoomState();
  const { handleReady, handleExit } = useSinglePlay();

  return (
    <GameRoomView
      onReady={handleReady}
      onExit={handleExit}
      playingView={<SingleTicTacToe onExit={handleExit} />}
    />
  );
}
