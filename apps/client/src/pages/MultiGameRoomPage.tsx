import { useInitializeMe } from "../features/game/hooks/useInitializeMe";
import { useMultiPlay } from "../features/game/hooks/multi/useMultiPlay";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGameSocketConnection } from "../features/game/hooks/multi/useGameSocketConnection";
import { ROUTES } from "@/shared/constants/routes";
import GameOver from "@/features/game/components/GameOver";
import { useUserStore } from "@/stores/useUserStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useGameStore } from "@/stores/useGameStore";
import { ToastContainer } from "react-toastify";
import Marquee from "react-fast-marquee";
import Ready from "../layouts/Ready";
import HeaderLayout from "@/layouts/HeaderLayout";
import { ImageManager } from "@/shared/services/ImageManger";
import LeftSideLayout from "@/layouts/LeftSideLayout";
import ExitModal from "@/shared/modals/ExitModal";
import { useSendPlayerLeave } from "@/features/game/hooks/multi/useSendPlayerLeave";
import TicTacToe from "@/layouts/TicTacToe";
import { useMultiTicTacToe } from "@/features/game/hooks/multi/useMultiTicTacToe";
import Board from "@/features/game/components/Board";

function MultiReady() {
  useInitializeMe();
  const navigate = useNavigate();
  const playersInfos = useRoomStore((state) => state.playersInfos);
  const { handleReady } = useMultiPlay();
  const resetGame = useGameStore((state) => state.resetGame);

  const handleExit = () => {
    //서버로 퇴장 알림
    useSendPlayerLeave();
    //페이지 이동
    resetGame();
    navigate("/lobby", { replace: true });
  };
  const ExitModalComponent = <ExitModal handleExit={handleExit} />;
  return (
    <Ready
      onReady={handleReady}
      handleExit={handleExit}
      ExitModalSlot={ExitModalComponent}
      readyDisabled={playersInfos.length < 2}
    />
  );
}

function MultiTicTacToe() {
  const { canSelectSquare, handleSquare } = useMultiTicTacToe();
  const navigate = useNavigate();
  const { sendLeave } = useSendPlayerLeave();
  const resetGame = useGameStore((state) => state.resetGame);
  const clearGameServerConnection = useRoomStore(
    (state) => state.clearGameServerConnection,
  );
  const setReadyTimeoutSnapshot = useRoomStore(
    (state) => state.setReadyTimeoutSnapshot,
  );
  const handleExit = () => {
    sendLeave();
    clearGameServerConnection();
    setReadyTimeoutSnapshot(null);
    resetGame();
    navigate("/lobby", { replace: true });
  };

  const BoardComponent = (
    <Board selectSquare={canSelectSquare ? handleSquare : undefined} />
  );
  const ExitModalComponent = <ExitModal handleExit={handleExit} />;
  return (
    <TicTacToe BoardSlot={BoardComponent} ExitModalSlot={ExitModalComponent} />
  );
}

export default function MultiGameRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    return <Navigate to={ROUTES.lobby} replace />;
  }

  useGameSocketConnection(roomId);

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
      {status === "IDLE" && <MultiReady />}
      {status === "PLAYING" && <MultiTicTacToe />}
      {status === "GAME_OVER" && <GameOver />}
    </>
  );
}
