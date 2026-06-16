import Players from "../features/game/components/Players";
import Countdown from "@/shared/components/Countdown";
import { useGameStore } from "@/stores/useGameStore";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";

interface TicTacToeProps {
  BoardSlot: React.ReactNode;
  ExitModalSlot: React.ReactNode;
  countdownOnComplete?: () => void;
}

export default function TicTacToe({
  // slot 만 뚫어 놓고 구체적인 컴포넌트는 page 에서
  BoardSlot,
  ExitModalSlot,
  countdownOnComplete,
}: TicTacToeProps) {
  const openModal = useBackExitModal();
  const tree = useGameStore((state) => state.tree);
  const isGameOver = tree.game.status === "GAME_OVER";
  const turnStartTime = useGameStore((state) => state.turnStartTime);
  const serverTurnTimer = useGameStore((state) => state.serverTurnTimer);
  const countdownDurationMs = serverTurnTimer?.timeoutMs ?? 10000;
  const countdownStartTime = serverTurnTimer?.startedAt ?? turnStartTime;

  return (
    <main className="relative flex flex-col min-h-screen p-4 md:p-8 items-center justify-center">
      <div className="w-full md:w-auto mb-6 md:mb-0 flex flex-col items-center justify-center gap-4 md:absolute md:left-8 md:top-1/2 md:-translate-y-1/2">
        <Players />
      </div>
      <div
        className={`w-full max-w-150 aspect-square flex items-center justify-center rounded-2xl backdrop-blur-sm p-4 md:p-6 mx-auto${isGameOver ? " animate__animated animate__hinge" : ""}`}
      >
        {BoardSlot}
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

      {openModal === "exit" && ExitModalSlot}
    </main>
  );
}
