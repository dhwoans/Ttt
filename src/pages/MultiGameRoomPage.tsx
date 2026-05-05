import { useRoomState } from "../features/game/hooks/useRoomState";
import { useMultiPlay } from "../features/game/hooks/multi/useMultiPlay";
import GameRoomView from "./GameRoomView";
import { Navigate, useParams } from "react-router-dom";
import { useGameSocketConnection } from "../features/game/hooks/multi/useGameSocketConnection";
import { ROUTES } from "@/shared/constants/routes";
import { MultiTicTacToe } from "./TicTacToe";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

export default function MultiGameRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    return <Navigate to={ROUTES.lobby} replace />;
  }

  useGameSocketConnection(roomId);
  useRoomState();

  const playersInfos = useTicTacToeGameStore((state) => state.playersInfos);
  const multiPlay = useMultiPlay();

  return (
    <GameRoomView
      readyDisabled={playersInfos.length < 2}
      onReady={multiPlay.handleReady}
      onExit={multiPlay.handleExit}
      playingView={<MultiTicTacToe onExit={multiPlay.handleExit} />}
    />
  );
}
