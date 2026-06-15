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

import { useRoomStore } from "@/stores/useRoomStore";

export function useGameResult() {
  const nickname = useUserStore((state) => state.currentUser?.nickname);
  const tree = useGameStore((state) => state.tree);
  const playersInfos = useRoomStore((state) => state.playersInfos);

  const { status, winner: winnerIndex } = tree.game;
  const isGameOver = status === "GAME_OVER";

  const winnerNickname = winnerIndex >= 0 ? playersInfos[winnerIndex]?.nickname : null;

  const resolved =
    !isGameOver || winnerIndex === -2
      ? "무승부"
      : winnerNickname === nickname
        ? "승리"
        : "패배";

  const imgSrc = resolved === "승리" ? WIN : resolved === "패배" ? LOOSE : DRAW;

  useEffect(() => {
    if (!isGameOver) return;

    if (resolved === "승리") {
      audioManager.play("win");
    }

    triggerConfetti(resolved);
  }, [isGameOver, resolved]);

  return { result: resolved, imgSrc };
}
