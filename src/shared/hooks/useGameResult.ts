import { useEffect } from "react";
import JSConfetti from "js-confetti";
import { audioManager } from "@/shared/services/AudioManager";
import { ImageManager } from "@/shared/services/ImageManger";
import { useUserStore } from "@/stores/useUserStore";
import { useGameStore } from "@/stores/useGameStore";

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

export function useGameResult() {
  const nickname = useUserStore((state) => state.myPlayer?.nickname);
  const winner = useGameStore((state) => state.gameState.winner);
  const result = useGameStore((state) => state.gameState.result);

  const resolved =
    result === "draw" ? "무승부" : winner === nickname ? "승리" : "패배";

  const imgSrc = resolved === "승리" ? WIN : resolved === "패배" ? LOOSE : DRAW;

  useEffect(() => {
    if (!result) return;

    if (resolved === "승리") {
      audioManager.play("win");
    }

    triggerConfetti(resolved);
  }, [result, resolved]);

  return { result: resolved, imgSrc };
}
