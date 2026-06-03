import { useState, useCallback, useEffect } from "react";
import { VersusBanner } from "@/features/game/components/VersusBanner";
import ExitModal from "@/shared/modals/ExitModal";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { TimeoutProgressBar } from "@/shared/components/TimeoutProgressBar";
import { Button } from "@/components/ui/button";
import { useRoomStore } from "@/stores/useRoomStore";

interface SingleReadyProps {
  onReady: (isReady: boolean) => void;
  onExit: () => void;
  readyDisabled?: boolean;
}

export default function Ready({
  onReady,
  onExit,
  readyDisabled = false,
}: SingleReadyProps) {
  const playersInfos = useRoomStore((state) => state.playersInfos);
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
      <VersusBanner playersInfos={playersInfos} />

      <TimeoutProgressBar
        eventName="READY_TIMEOUT_STARTED"
        label="준비 제한 시간"
      />

      <div className="flex flex-col gap-4">
        <Button
          onClick={() => handleReadyClick()}
          size="lg"
          className={`px-10 py-4 text-2xl font-black text-dark-1 ${
            isReady ? "bg-red-500" : ""
          }`}
          disabled={readyDisabled}
        >
          {isReady ? "취소" : "준비"}
        </Button>
        <Button
          onClick={handleExit}
          size="lg"
          variant="secondary"
          className="px-10 py-4 text-2xl font-black text-dark-1"
        >
          나가기
        </Button>
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
