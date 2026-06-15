import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LobbyMainLayout from "@/layouts/LobbyMainLayout";
import Marquee from "react-fast-marquee";
import HeaderLayout from "@/layouts/HeaderLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FooterLayout from "@/layouts/FooterLayout";
import LeftSideLayout from "@/layouts/LeftSideLayout";
import { ROUTES } from "@/shared/constants/routes";
import ExitModal from "@/shared/modals/ExitModal";
import { ImageManager } from "@/shared/services/ImageManger";
import { useUserStore } from "@/stores/useUserStore";
import { useGameStore } from "@/stores/useGameStore";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { useRoomNavigation } from "@/shared/hooks/useRoomNavigation";

function LobbyExitModel() {
  const navigate = useNavigate();
  const clearCurrentUser = useUserStore((state) => state.clearCurrentUser);
  const resetGame = useGameStore((state) => state.resetGame);
  const handleLeaveLobby = useCallback(() => {
    clearCurrentUser();
    resetGame();
    navigate(ROUTES.login, { replace: true });
  }, [clearCurrentUser, navigate, resetGame]);
  return <ExitModal handleExit={handleLeaveLobby} />;
}

export default function LobbyPage() {
  const nickname = useUserStore((state) => state.currentUser?.nickname);
  useRoomNavigation();

  // 뒤로가기 감지, 모달창 띄움
  const openModal = useBackExitModal();

  return (
    <div>
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        limit={1}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <HeaderLayout className="z-30">
        <Marquee
          autoFill
          className="w-full h-8 bg-white border-y-4 border-black text-black"
        >
          <span className="flex items-center gap-1 mr-40 font-bold text-sm">
            {nickname}
          </span>
        </Marquee>
      </HeaderLayout>
      <LeftSideLayout className="z-10">
        {/* 데코 상단 좌 */}
        <img
          className="z-10 -rotate-20 -translate-20 translate-y-50"
          src={ImageManager.ticTacToe}
          alt=""
          aria-hidden="true"
        />
      </LeftSideLayout>
      <section className="relative z-20 flex min-h-screen items-center justify-center px-[10%]">
        <LobbyMainLayout />
      </section>
      <FooterLayout className="z-40 flex justify-end">
        <img
          className="pointer-events-none h-50 w-150 -rotate-10 translate-y-20 blur-xs"
          src={ImageManager.click}
        />
      </FooterLayout>

      {openModal === "exit" && <LobbyExitModel />}
    </div>
  );
}
