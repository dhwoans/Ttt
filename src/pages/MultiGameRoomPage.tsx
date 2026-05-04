import { useRoomState } from "../features/game/hooks/useRoomState";
import { useMultiPlay } from "../features/game/hooks/useMultiPlay";
import GameRoomView from "./GameRoomView";
import { Navigate, useParams } from "react-router-dom";
import { useGameSocketConnection } from "../features/game/hooks/useGameSocketConnection";
import { ROUTES } from "@/shared/constants/routes";
import { MultiTicTacToe } from "./TicTacToe";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

export default function MultiGameRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    return <Navigate to={ROUTES.lobby} replace />;
  }

  useGameSocketConnection(roomId);

  const nickname = useTicTacToeGameStore(
    (state) => state.myPlayer?.nickname ?? null,
  );
  const { playersInfos, phase, setPhase } = useRoomState();

  const multiPlay = useMultiPlay({ phase, setPhase });

  return (
    <GameRoomView
      nickname={nickname}
      phase={phase}
      playersInfos={playersInfos}
      playersReadyStatus={multiPlay.playersReadyStatus}
      readyDisabled={playersInfos.length < 2}
      onReady={multiPlay.handleReady}
      onExit={multiPlay.handleExit}
      playingView={
        <MultiTicTacToe
          playersInfos={playersInfos}
          onExit={multiPlay.handleExit}
        />
      }
    />
  );
}
