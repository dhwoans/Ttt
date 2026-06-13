import { useNavigate } from "react-router-dom";
import { useGameResult } from "@/shared/hooks/useGameResult";
import { Button } from "@ttt/ui";
import { useGameStore } from "@/stores/useGameStore";

export default function GameOver() {
  const navigate = useNavigate();
  const { result, imgSrc } = useGameResult();
  const resetGameBoard = useGameStore((state) => state.resetGameBoard);
  const resetGame = useGameStore((state) => state.resetGame);

  const handleExit = () => {
    resetGame();
    navigate("/lobby", { replace: true });
  };

  return (
    <>
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
        <Button onClick={resetGameBoard} size="lg" variant="default">
          다시하기
        </Button>
        <Button onClick={handleExit} size="lg" variant="secondary">
          나가기
        </Button>
      </div>
    </>
  );
}
