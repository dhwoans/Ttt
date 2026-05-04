import { useState, useEffect } from "react";
import JSConfetti from "js-confetti";
import { audioManager } from "@/shared/utils/AudioManager";
import { ImageManager } from "@/shared/utils/ImageManger";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

const WIN = ImageManager.horns;
const LOOSE = ImageManager.thumbsDown;
const DRAW = ImageManager.handshake;

const triggerConfetti = (result: string) => {
  const emoji = result === "승리" ? "👍" : "💩";
  const jsConfetti = new JSConfetti();
  jsConfetti.addConfetti({
    emojis: [emoji],
    emojiSize: 80,
    confettiNumber: 10,
  });
};

interface UseGameResultProps {
  winner: string;
  onExit: () => void;
  exitTime?: number;
}

export function useGameResult({
  winner,
  onExit,
  exitTime = 5000,
}: UseGameResultProps) {
  console.log(winner);
  const nickname = useTicTacToeGameStore((state) => state.myPlayer?.nickname);
  const [result, setResult] = useState("무승부");

  const imgSrc = result === "승리" ? WIN : result === "패배" ? LOOSE : DRAW;

  useEffect(() => {
    if (!winner) return;

    const resolved =
      winner !== "DRAW" ? (winner === nickname ? "승리" : "패배") : "무승부";

    if (resolved === "승리") {
      audioManager.play("win");
    }

    setResult(resolved);
    triggerConfetti(resolved);
    // 자동 onExit
    const timeoutId = setTimeout(onExit, exitTime);
    return () => clearTimeout(timeoutId);
  }, [exitTime, nickname, onExit, winner]);

  return { result, imgSrc };
}
