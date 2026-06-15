import { useInitializeMe } from "../features/game/hooks/useInitializeMe";
import GameOver from "@/features/game/components/GameOver";
import { ToastContainer } from "react-toastify";
import Marquee from "react-fast-marquee";
import Ready from "../layouts/Ready";
import HeaderLayout from "@/layouts/HeaderLayout";
import { ImageManager } from "@/shared/services/ImageManger";
import LeftSideLayout from "@/layouts/LeftSideLayout";
import { useUserStore } from "@/stores/useUserStore";
import { useGameStore } from "@/stores/useGameStore";
import ExitModal from "@/shared/modals/ExitModal";
import { useNavigate } from "react-router-dom";
import { useSingleReady } from "@/features/game/hooks/single/useSingleReady";
import { useBotSetup } from "../features/game/hooks/single/useBotSetup";
import TicTacToe from "@/layouts/TicTacToe";
import { useSingleTicTacToe } from "@/features/game/hooks/single/useSingleTicTacToe";
import Board from "@/features/game/components/Board";

function SingleReady() {
  useInitializeMe();
  useBotSetup();
  const { handleReady } = useSingleReady();

  const navigate = useNavigate();
  const resetGame = useGameStore((state) => state.resetGame);

  const handleExit = () => {
    resetGame();
    navigate("/lobby", { replace: true });
  };
  const ExitModalComponent = <ExitModal handleExit={handleExit} />;
  return (
    <Ready
      onReady={handleReady}
      handleExit={handleExit}
      ExitModalSlot={ExitModalComponent}
    />
  );
}

function SingleTicTacToe() {
  const { canSelectSquare, handleSquare } = useSingleTicTacToe();
  const navigate = useNavigate();
  const resetGameBoard = useGameStore((state) => state.resetGameBoard);
  const handleExit = () => {
    resetGameBoard();
    navigate("/lobby", { replace: true });
  };

  const BoardComponent = (
    <Board selectSquare={canSelectSquare ? handleSquare : undefined} />
  );
  const ExitModalComponent = <ExitModal handleExit={handleExit} />;
  return (
    <TicTacToe
      BoardSlot={BoardComponent}
      ExitModalSlot={ExitModalComponent}
    />
  );
}

export default function SingleGameRoomPage() {
  const nickname = useUserStore((state) => state.currentUser?.nickname ?? "");
  const status = useGameStore((state) => state.tree.game.status);
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
      {status === "IDLE" && <SingleReady />}
      {status === "PLAYING" && <SingleTicTacToe />}
      {status === "GAME_OVER" && <GameOver />}
    </>
  );
}
