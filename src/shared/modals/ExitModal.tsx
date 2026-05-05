import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ExitModalProps {
  sender: {
    handleLeave: () => void;
  };
  onClose?: () => void;
  title?: string;
  navigateToLobbyOnLeave?: boolean;
}

export default function ExitModal({
  sender,
  onClose,
  title = "나가시겠습니까?",
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
    if (onClose) onClose();
  };

  const handleLeave = () => {
    sender.handleLeave();
    if (navigateToLobbyOnLeave) {
      navigator("/lobby", { replace: true });
    }
  };

  const brutalBox =
    "border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
  const brutalBtn = `${brutalBox} hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all active:scale-95`;

  return (
    <dialog
      open
      className="exit fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent border-0 p-0 w-full h-full flex items-center justify-center z-50"
    >
      <div className="fixed inset-0 bg-black/50 -z-10" />
      <div className="bg-white rounded-2xl p-8 max-w-md w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate__animated animate__bounceIn relative z-10">
        <h3 className="text-2xl font-black text-center mb-6 text-gray-800">
          {title}
        </h3>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStay}
            className={`px-8 py-3 rounded-xl text-lg font-bold bg-gray-300 hover:bg-gray-400 ${brutalBtn}`}
          >
            머무르기
          </button>
          <button
            onClick={handleLeave}
            className={`px-8 py-3 rounded-xl text-lg font-bold bg-red-500 hover:bg-red-600 text-white ${brutalBtn}`}
          >
            나가기
          </button>
        </div>
      </div>
    </dialog>
  );
}
