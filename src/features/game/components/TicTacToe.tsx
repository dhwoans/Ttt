import Board from "./Board";
import Players from "./Players";
import Countdown from "@/shared/components/Countdown";
import ExitModal from "@/shared/modals/ExitModal";
import { useModalStore } from "@/stores/useModalStore";
import { useGameStore } from "@/stores/useGameStore";
import { useRoomStore } from "@/stores/useRoomStore";

interface TicTacToeProps {
  canSelectSquare: boolean;
  handleSquare: (row: number, col: number) => void;
  handleExit: () => void;
  countdownOnComplete?: () => void;
}

export default function TicTacToe({
  canSelectSquare,
  handleSquare,
  handleExit,
  countdownOnComplete,
}: TicTacToeProps) {
  const openModal = useModalStore((state) => state.openModal);
  const showExitModal = openModal === "exit";
  const status = useGameStore((state) => state.gameState.status);
  const isGameOver = status === "FINISHED";
  const turnStart = useGameStore((state) => state.turnStart);
  const turnTimeoutSnapshot = useGameStore(
    (state) => state.turnTimeoutSnapshot,
  );
  const moveHistory = useGameStore((state) => state.moveHistory);
  const currentTurnUserId = useGameStore(
    (state) => state.gameState.turn.currentUserId,
  );
  const playersInfos = useRoomStore((state) => state.playersInfos);

  const currentTurnNickname = (() => {
    if (currentTurnUserId) {
      return (
        playersInfos.find((player) => player.userId === currentTurnUserId)
          ?.nickname ?? ""
      );
    }

    return playersInfos[moveHistory.length % 2]?.nickname ?? "";
  })();

  const countdownDurationMs = turnTimeoutSnapshot?.timeoutMs ?? 10000;
  const countdownStartTime = turnTimeoutSnapshot?.startedAt ?? turnStart;

  return (
    <main className="relative flex flex-col min-h-screen p-4 md:p-8 items-center justify-center">
      <div className="w-full md:w-auto mb-6 md:mb-0 flex flex-col items-center justify-center gap-4 md:absolute md:left-8 md:top-1/2 md:-translate-y-1/2">
        <Players currentTurnNickname={currentTurnNickname} />
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
          sender={{ handleLeave: handleExit }}
        />
      )}
    </main>
  );
}
