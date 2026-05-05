import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import Marquee from "react-fast-marquee";
import Ready from "./Ready";
import HeaderLayout from "./layouts/HeaderLayout";
import { ImageManager } from "@/shared/utils/ImageManger";
import LeftSideLayout from "@/pages/layouts/LeftSideLayout";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

interface GameRoomViewProps {
  readyDisabled?: boolean;
  onReady: (isReady: boolean) => void;
  onExit: () => void;
  playingView: ReactNode;
}

export default function GameRoomView({
  readyDisabled = false,
  onReady,
  onExit,
  playingView,
}: GameRoomViewProps) {
  const nickname = useTicTacToeGameStore(
    (state) => state.myPlayer?.nickname ?? "",
  );
  const playersInfos = useTicTacToeGameStore((state) => state.playersInfos);
  const status = useTicTacToeGameStore((state) => state.gameState.status);
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <HeaderLayout>
        <Marquee
          autoFill
          className="w-full h-8 bg-white border-y-4 border-black text-black"
        >
          <span className="flex items-center gap-1 mr-40 font-bold text-sm">
            🎮 {nickname}
          </span>
        </Marquee>
      </HeaderLayout>
      {status === "IDLE" && (
        <Ready
          onReady={onReady}
          onExit={onExit}
          readyDisabled={readyDisabled}
        />
      )}
      <LeftSideLayout className="-z-10 pointer-events-none">
        {/* 데코 상단 좌 */}
        <img
          className="-rotate-20 -translate-20 translate-y-50 blur-xs"
          src={ImageManager.ticTacToe}
          alt=""
          aria-hidden="true"
        />
      </LeftSideLayout>
      {status === "PLAYING" && playingView}
    </>
  );
}
