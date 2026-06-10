import { useNavigate } from "react-router-dom";
import TicTacToe from "@/layouts/TicTacToe";
import { useSingleTicTacToe } from "@/features/game/hooks/single/useSingleTicTacToe";

import Board from "@/features/game/components/Board";
import { useGameStore } from "@/stores/useGameStore";
import ExitModal from "@/shared/modals/ExitModal";

export default function SingleTicTacToe() {
  const { canSelectSquare, handleSquare, countdownOnComplete } =
    useSingleTicTacToe();
  const navigate = useNavigate();
  const resetGameBoard = useGameStore((state) => state.resetGameBoard);
  const handleExit = () => {
    resetGameBoard();
    navigate("/lobby", { replace: true });
  };

  const BoardComponent = (
    <Board selectSquare={canSelectSquare ? handleSquare : undefined} />
  );
  const ExitModalComponent = <ExitModal handleExit={handleExit} />;
  return (
    <TicTacToe
      BoardSlot={BoardComponent}
      ExitModalSlot={ExitModalComponent}
      countdownOnComplete={countdownOnComplete}
    />
  );
}
