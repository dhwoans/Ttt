import { useState, useCallback, useEffect } from "react";
import { VersusBanner } from "@/features/game/components/VersusBanner";
import ExitModal from "@/shared/modals/ExitModal";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { TimeoutProgressBar } from "@/shared/components/TimeoutProgressBar";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

interface SingleReadyProps {
  onReady: (isReady: boolean) => void;
  onExit: () => void;
  readyDisabled?: boolean;
}

const brutalBox =
  "border-[0.25rem] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
const brutalBtn = `${brutalBox} hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all active:scale-95`;

export default function Ready({
  onReady,
  onExit,
  readyDisabled = false,
}: SingleReadyProps) {
  const playersInfos = useTicTacToeGameStore((state) => state.playersInfos);
  const playersReadyStatus = useTicTacToeGameStore(
    (state) => state.playersReadyStatus,
  );
  const [isReady, setIsReady] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const handleExitIntent = useCallback(() => {
    setShowExitModal(true);
  }, []);

  useBackExitModal(handleExitIntent, true);

  const handleExitCancel = () => setShowExitModal(false);

  const handleExit = () => {
    onExit();
  };

  const handleReadyClick = () => {
    const newReadyState = !isReady;
    console.log("[Ready] 준비 상태 변경:", isReady, "→", newReadyState);

    // 항상 onReady 호출하여 서버에 상태 전송 (준비/취소 모두)
    onReady(newReadyState);
    setIsReady(newReadyState);
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <VersusBanner
        playersInfos={playersInfos}
        playersReadyStatus={playersReadyStatus}
      />

      <TimeoutProgressBar
        eventName="READY_TIMEOUT_STARTED"
        label="준비 제한 시간"
      />

      <div className="flex flex-col gap-4">
        <button
          onClick={() => handleReadyClick()}
          className={`px-10 py-4 rounded-2xl text-2xl font-black ${
            isReady ? "bg-red-500" : "bg-accent"
          } text-dark-1 ${brutalBtn}`}
          disabled={readyDisabled}
        >
          {isReady ? "취소" : "준비"}
        </button>
        <button
          onClick={handleExit}
          className={`px-10 py-4 rounded-2xl text-2xl font-black bg-white text-dark-1 ${brutalBtn}`}
        >
          나가기
        </button>
      </div>

      {showExitModal && (
        <ExitModal
          onClose={handleExitCancel}
          sender={{ handleLeave: handleExit }}
        />
      )}
    </section>
  );
}
