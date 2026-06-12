import TicTacToe from "@/layouts/TicTacToe";
import { useMultiTicTacToe } from "@/features/game/hooks/multi/useMultiTicTacToe";
import { useRoomStore } from "@/stores/useRoomStore";
import { useGameStore } from "@/stores/useGameStore";
import Board from "@/features/game/components/Board";
import { useNavigate } from "react-router-dom";
import { useSendPlayerLeave } from "@/features/game/hooks/multi/useSendPlayerLeave";
import ExitModal from "@/shared/modals/ExitModal";

export default function MultiTicTacToe() {
  const { canSelectSquare, handleSquare } = useMultiTicTacToe();
  const navigate = useNavigate();
  const { sendLeave } = useSendPlayerLeave();
  const resetGame = useGameStore((state) => state.resetGame);
  const clearGameServerConnection = useRoomStore(
    (state) => state.clearGameServerConnection,
  );
  const setReadyTimeoutSnapshot = useRoomStore(
    (state) => state.setReadyTimeoutSnapshot,
  );
  const handleExit = () => {
    sendLeave();
    clearGameServerConnection();
    setReadyTimeoutSnapshot(null);
    resetGame();
    navigate("/lobby", { replace: true });
  };

  const BoardComponent = (
    <Board selectSquare={canSelectSquare ? handleSquare : undefined} />
  );
  const ExitModalComponent = <ExitModal handleExit={handleExit} />;
  return (
    <TicTacToe BoardSlot={BoardComponent} ExitModalSlot={ExitModalComponent} />
  );
}
