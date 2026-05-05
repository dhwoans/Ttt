import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LobbyMainLayout from "./layouts/LobbyMainLayout";
import Marquee from "react-fast-marquee";
import HeaderLayout from "./layouts/HeaderLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FooterLayout from "./layouts/FooterLayout";
import LeftSideLayout from "./layouts/LeftSideLayout";
import { ROUTES } from "@/shared/constants/routes";
import ExitModal from "@/shared/modals/ExitModal";
import { ImageManager } from "@/shared/utils/ImageManger";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

export default function LobbyPage() {
  const navigate = useNavigate();
  const nickname = useTicTacToeGameStore((state) => state.myPlayer?.nickname);
  const clearMyPlayer = useTicTacToeGameStore((state) => state.clearMyPlayer);
  const resetGame = useTicTacToeGameStore((state) => state.resetGame);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    window.history.pushState({ lobbyBackTrap: true }, "", currentUrl);

    const handlePopState = () => {
      setShowExitModal(true);
      window.history.pushState({ lobbyBackTrap: true }, "", currentUrl);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  // exitModal 관련 로직
  const handleStay = useCallback(() => {
    setShowExitModal(false);
  }, []);

  const handleLeaveLobby = useCallback(() => {
    clearMyPlayer();
    resetGame();
    localStorage.removeItem("gameState");
    navigate(ROUTES.login, { replace: true });
  }, [clearMyPlayer, navigate, resetGame]);

  return (
    <>
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

      {showExitModal && (
        <ExitModal
          onClose={handleStay}
          sender={{ handleLeave: handleLeaveLobby }}
          title="로비를 나가시겠습니까?"
          navigateToLobbyOnLeave={false}
        />
      )}
    </>
  );
}
