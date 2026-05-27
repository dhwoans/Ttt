import { useGameResult } from "@/shared/hooks/useGameResult";
import { useGameStore } from "@/stores/useGameStore";
import { useNavigate } from "react-router-dom";

export default function GameOverModal() {
  const navigator = useNavigate();
  const { result, imgSrc } = useGameResult();
  const resetGame = useGameStore((state) => state.resetGame);
  const onExit = () => {
    resetGame();
    navigator("/lobby", { replace: true });
  };

  return (
    <dialog
      open
      className="game-over fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full h-full flex items-center justify-center bg-transparent p-0 border-0 transform"
    >
      <div className="fixed inset-0 bg-black/50 -z-10" />
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate__animated animate__bounceIn relative z-10">
        <h2
          className={`result text-5xl font-black text-center mb-6 ${
            result === "승리"
              ? "text-green-600"
              : result === "패배"
                ? "text-red-600"
                : "text-gray-600"
          }`}
        >
          {result}
        </h2>

        <video
          src={imgSrc}
          autoPlay
          loop
          className="w-64 h-64 mx-auto object-contain mb-6"
        />

        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={resetGame}
            className="brutal-btn px-8 py-3 rounded-xl text-lg font-bold bg-accent hover:bg-yellow-400"
          >
            다시하기
          </button>
          <button
            onClick={onExit}
            className="brutal-btn px-8 py-3 rounded-xl text-lg font-bold bg-gray-300 hover:bg-gray-400"
          >
            나가기
          </button>
        </div>

        {/* 진행 표시 제거됨 */}
      </div>
    </dialog>
  );
}
