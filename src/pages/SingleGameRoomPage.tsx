import { useRoomState } from "../features/game/hooks/useRoomState";
import { useSinglePlay } from "../features/game/hooks/single/useSinglePlay";
import { SingleTicTacToe } from "./TicTacToe";
import { ToastContainer } from "react-toastify";
import Marquee from "react-fast-marquee";
import Ready from "./Ready";
import HeaderLayout from "@/layouts/HeaderLayout";
import { ImageManager } from "@/shared/services/ImageManger";
import LeftSideLayout from "@/layouts/LeftSideLayout";
import { useUserStore } from "@/stores/useUserStore";
import { useGameStore } from "@/stores/useGameStore";

export default function SingleGameRoomPage() {
  useRoomState();
  const { handleReady, handleExit } = useSinglePlay();
  const nickname = useUserStore((state) => state.myPlayer?.nickname ?? "");
  const status = useGameStore((state) => state.gameState.status);

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
      <LeftSideLayout className="-z-10 pointer-events-none">
        <img
          className="-rotate-20 -translate-20 translate-y-50 blur-xs"
          src={ImageManager.ticTacToe}
          alt=""
          aria-hidden="true"
        />
      </LeftSideLayout>
      {status === "IDLE" && <Ready onReady={handleReady} onExit={handleExit} />}
      {status === "PLAYING" && <SingleTicTacToe onExit={handleExit} />}
    </>
  );
}
