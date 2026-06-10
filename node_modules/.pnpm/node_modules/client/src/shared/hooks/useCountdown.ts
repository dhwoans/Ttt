import { useEffect, useState, useRef } from "react";

/**
 * 타이머 카운트다운 훅
 * countdownManager와 React 컴포넌트 간의 브릿지 역할
 *
 * @param durationMs - 지속시간 (밀리초)
 * @param onComplete - 완료 콜백
 * @param autoStart - 자동 시작 여부
 * @returns 남은 시간 (밀리초)
 */
export const useCountdown = (
  durationMs: number,
  onComplete?: () => void,
  autoStart = true,
  initialStartTime?: number,
): number => {
  // 남은 시간 계산: durationMs - (현재시각 - initialStartTime)
  const getInitialRemaining = () => {
    if (initialStartTime) {
      const elapsed = Date.now() - initialStartTime;
      return Math.max(0, durationMs - elapsed);
    }
    return durationMs;
  };
  const [remaining, setRemaining] = useState<number>(getInitialRemaining());
  const rafRef = useRef<number>(0);
  const completedRef = useRef(false);

  // 새로고침 등으로 이미 시간이 지난 경우 즉시 onComplete 호출
  useEffect(() => {
    if (getInitialRemaining() <= 0 && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setRemaining(getInitialRemaining());
    completedRef.current = false;

    if (!autoStart) return;

    const start = initialStartTime ?? Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const left = Math.max(0, durationMs - elapsed);
      setRemaining(left);
      if (left <= 0) {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line
  }, [durationMs, autoStart, onComplete, initialStartTime]);

  return remaining;
};
