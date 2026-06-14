import { useEffect, useState, useRef } from "react";

/**
 * 타이머 카운트다운 훅 (UI 전용)
 * 규칙(Rules)은 GameTimerService나 서버에서 처리하고, 이 훅은 단순히 남은 시간을 시각화한다.
 *
 * @param durationMs - 지속시간 (밀리초)
 * @param initialStartTime - 타이머 시작 시각 (Date.now())
 * @param onComplete - (Optional) UI 애니메이션 등이 끝났을 때의 콜백
 * @returns 남은 시간 (밀리초)
 */
export const useCountdown = (
  durationMs: number,
  initialStartTime: number,
  onComplete?: () => void,
): number => {
  const getRemaining = () => {
    const elapsed = Date.now() - initialStartTime;
    return Math.max(0, durationMs - elapsed);
  };

  const [remaining, setRemaining] = useState<number>(getRemaining());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const left = getRemaining();
      setRemaining(left);

      if (left <= 0) {
        onComplete?.();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [durationMs, initialStartTime, onComplete]);

  return remaining;
};
