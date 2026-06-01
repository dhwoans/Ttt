import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/Button";
import { ModalShell } from "@/shared/components/ModalShell";

interface ExitModalProps {
  sender: {
    handleLeave: () => void;
  };
  onClose?: () => void;
  navigateToLobbyOnLeave?: boolean;
}

export default function ExitModal({
  sender,
  onClose,
  navigateToLobbyOnLeave = true,
}: ExitModalProps) {
  const navigator = useNavigate();
  useEffect(() => {
    // 히스토리 트랩 설정 중복 방지
    history.pushState(null, "", location.href);

    const handlePopState = () => {
      history.pushState(null, "", location.href);
      // 모달이 이미 열려있으면 무시
      if (document.querySelector("dialog.exit")) {
        return;
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleStay = () => {
    return onClose && onClose();
  };

  const handleLeave = () => {
    sender.handleLeave();
    if (navigateToLobbyOnLeave) {
      navigator("/lobby", { replace: true });
    }
  };

  return (
    <ModalShell dialogClassName="exit" className="max-w-md">
      <h3 className="text-2xl font-black text-center mb-6 text-gray-800">
        "나가시겠습니까?"
      </h3>

      <div className="flex gap-4 justify-center">
        <Button onClick={handleStay} size="lg" variant="secondary">
          머무르기
        </Button>
        <Button onClick={handleLeave} size="lg" variant="danger">
          나가기
        </Button>
      </div>
    </ModalShell>
  );
}
