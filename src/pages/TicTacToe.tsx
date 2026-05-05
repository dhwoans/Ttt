import Board from "../features/game/components/Board";
import Players from "../features/game/components/Players";
import GameOverModal from "@/shared/modals/GameOverModal";
import Countdown from "@/shared/components/Countdown";
import ExitModal from "@/shared/modals/ExitModal";
import { useSingleTicTacToe } from "../features/game/hooks/single/useSingleTicTacToe";
import { useMultiTicTacToe } from "../features/game/hooks/multi/useMultiTicTacToe";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

interface PlayingProps {
  onExit?: () => void;
}

interface TicTacToeViewProps {
  canSelectSquare: boolean;
  handleSquare: (row: number, col: number) => void;
  isGameOver: boolean;
  currentTurnNickname: string;
  showExitModal: boolean;
  showGameOverModal: boolean;
  handleExitCancel: () => void;
  handleExit: () => void;
  isDraw: boolean;
  winner: string | null;
  countdownDurationMs: number;
  countdownStartTime: number;
  countdownOnComplete?: () => void;
}

function TicTacToeView({
  canSelectSquare,
  handleSquare,
  isGameOver,
  currentTurnNickname,
  showExitModal,
  showGameOverModal,
  handleExitCancel,
  handleExit,
  isDraw,
  winner,
  countdownDurationMs,
  countdownStartTime,
  countdownOnComplete,
}: TicTacToeViewProps) {
  const playersInfos = useTicTacToeGameStore((state) => state.playersInfos);
  return (
    <main className="relative flex flex-col min-h-screen p-4 md:p-8 items-center justify-center">
      <div className="w-full md:w-auto mb-6 md:mb-0 flex flex-col items-center justify-center gap-4 md:absolute md:left-8 md:top-1/2 md:-translate-y-1/2">
        <Players playerInfos={playersInfos} isTurn={currentTurnNickname} />
      </div>
      <div
        className={`w-full max-w-150 aspect-square flex items-center justify-center rounded-2xl backdrop-blur-sm p-4 md:p-6 mx-auto${isGameOver ? " animate__animated animate__hinge" : ""}`}
      >
        <Board selectSquare={canSelectSquare ? handleSquare : false} />
      </div>

      {!isGameOver && (
        <div className="fixed right-10 bottom-4 md:right-12 md:bottom-8 z-40">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-sky-500 border-4 border-black flex flex-col items-center justify-center gap-1 shadow-lg">
            <Countdown
              durationMs={countdownDurationMs}
              className="text-5xl md:text-6xl font-extrabold text-white leading-none tabular-nums transition-colors [text-shadow:2px_2px_0_#000,-2px_2px_0_#000,2px_-2px_0_#000,-2px_-2px_0_#000]"
              onComplete={countdownOnComplete}
              initialStartTime={countdownStartTime}
            />
          </div>
        </div>
      )}

      {showExitModal && (
        <ExitModal
          onClose={handleExitCancel}
          sender={{ handleLeave: handleExit }}
        />
      )}

      {showGameOverModal && (
        <GameOverModal winner={isDraw ? "DRAW" : winner} onExit={handleExit} />
      )}
    </main>
  );
}

export function SingleTicTacToe({ onExit }: PlayingProps) {
  const {
    canSelectSquare,
    handleSquare,
    isGameOver,
    currentTurnNickname,
    showExitModal,
    showGameOverModal,
    handleExitCancel,
    handleExit,
    isDraw,
    winner,
    countdownDurationMs,
    countdownStartTime,
    countdownOnComplete,
  } = useSingleTicTacToe({ onExit });

  return (
    <TicTacToeView
      canSelectSquare={canSelectSquare}
      handleSquare={handleSquare}
      isGameOver={isGameOver}
      currentTurnNickname={currentTurnNickname}
      showExitModal={showExitModal}
      showGameOverModal={showGameOverModal}
      handleExitCancel={handleExitCancel}
      handleExit={handleExit}
      isDraw={isDraw}
      winner={winner}
      countdownDurationMs={countdownDurationMs}
      countdownStartTime={countdownStartTime}
      countdownOnComplete={countdownOnComplete}
    />
  );
}

export function MultiTicTacToe({ onExit }: PlayingProps) {
  const {
    canSelectSquare,
    handleSquare,
    isGameOver,
    currentTurnNickname,
    showExitModal,
    showGameOverModal,
    handleExitCancel,
    handleExit,
    isDraw,
    winner,
    countdownDurationMs,
    countdownStartTime,
  } = useMultiTicTacToe({ onExit });

  return (
    <TicTacToeView
      canSelectSquare={canSelectSquare}
      handleSquare={handleSquare}
      isGameOver={isGameOver}
      currentTurnNickname={currentTurnNickname}
      showExitModal={showExitModal}
      showGameOverModal={showGameOverModal}
      handleExitCancel={handleExitCancel}
      handleExit={handleExit}
      isDraw={isDraw}
      winner={winner}
      countdownDurationMs={countdownDurationMs}
      countdownStartTime={countdownStartTime}
    />
  );
}
