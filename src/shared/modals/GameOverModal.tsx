import { useGameResult } from "@/shared/hooks/useGameResult";
import { Button } from "@/shared/components/Button";
import { ModalShell } from "@/shared/components/ModalShell";
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
    <ModalShell dialogClassName="game-over" className="max-w-lg">
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
        <Button onClick={resetGame} size="lg" variant="primary">
          다시하기
        </Button>
        <Button onClick={onExit} size="lg" variant="secondary">
          나가기
        </Button>
      </div>

      {/* 진행 표시 제거됨 */}
    </ModalShell>
  );
}
