import { useState, useCallback, useEffect } from "react";
import { VersusBanner } from "@/features/game/components/VersusBanner";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal"; // 참고
import { TimeoutProgressBar } from "@/shared/components/TimeoutProgressBar";
import { Button } from "@/components/ui/button";
import { useRoomStore } from "@/stores/useRoomStore";
import { useModalStore } from "@/stores/useModalStore";
interface SingleReadyProps {
  onReady: (isReady: boolean) => void;
  handleExit: () => void;
  ExitModalSlot: React.ReactNode;
  readyDisabled?: boolean;
}

export default function Ready({
  onReady,
  handleExit,
  ExitModalSlot,
  readyDisabled = false,
}: SingleReadyProps) {
  const playersInfos = useRoomStore((state) => state.playersInfos);
  const [isReady, setIsReady] = useState(false);
  // 뒤로가기 감지, 모달창 띄움
  const openModal = useBackExitModal();

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
          onClick={handleReadyClick}
          size = "lg"
          variant={`${
            isReady ? "destructive" : "default"
          }`}
          disabled={readyDisabled}
        >
          {isReady ? "취소" : "준비"}
        </Button>
        <Button
          onClick={handleExit}
          size="lg"
          variant="secondary"
        >
          나가기
        </Button>
      </div>

      {openModal === "exit" && ExitModalSlot}
    </section>
  );
}
