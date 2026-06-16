import { useState, useEffect, useRef } from "react";
import { useRoomStore } from "@/stores/useRoomStore";

interface TimeoutProgressBarProps {
  /** 화면 상단에 표시할 라벨 (기본값: 미표시) */
  label?: string;
  /** 타임아웃 완료 시 콜백 */
  onTimeout?: () => void;
}

/**
 * 화면 상단에 바 형태로 표시되는 타임아웃 프로그레스 바
 * 이제는 Store의 readyTimeoutSnapshot을 기반으로만 동작함
 */
export function TimeoutProgressBar({
  label,
  onTimeout,
}: TimeoutProgressBarProps) {
  const readyTimeoutSnapshot = useRoomStore(
    (state) => state.readyTimeoutSnapshot,
  );
  const setReadyTimeoutSnapshot = useRoomStore(
    (state) => state.setReadyTimeoutSnapshot,
  );

  const [timeoutMs, setTimeoutMs] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState<number>(0);

  useEffect(() => {
    if (!readyTimeoutSnapshot) {
      setTimeoutMs(null);
      setRemainingMs(0);
      return;
    }

    const total = Number(readyTimeoutSnapshot.timeoutMs);
    const startedAt = Number(readyTimeoutSnapshot.startedAt);
    if (!Number.isFinite(total) || !Number.isFinite(startedAt) || total <= 0) {
      setReadyTimeoutSnapshot(null);
      return;
    }

    const elapsed = Date.now() - startedAt;
    const remain = total - elapsed;

    if (remain > 0) {
      setTimeoutMs(total);
      setRemainingMs(remain);
    } else {
      setReadyTimeoutSnapshot(null);
    }
  }, [readyTimeoutSnapshot, setReadyTimeoutSnapshot]);

  // 카운트다운 타이머
  useEffect(() => {
    if (!timeoutMs || remainingMs <= 0) return;

    const interval = setInterval(() => {
      setRemainingMs((prev) => {
        const next = prev - 100;
        if (next <= 0) {
          clearInterval(interval);
          onTimeout?.();
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [timeoutMs, remainingMs, onTimeout]);

  if (!timeoutMs || remainingMs <= 0) {
    return null;
  }

  const progressPercent = timeoutMs
    ? ((timeoutMs - remainingMs) / timeoutMs) * 100
    : 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-gray-200 h-1 shadow-md">
      <div
        className="h-full bg-red-500 transition-all duration-100 ease-linear"
        style={{ width: `${progressPercent}%` }}
      />
      {label && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-red-600 whitespace-nowrap pointer-events-none">
          {label}: {Math.ceil(remainingMs / 1000)}초
        </div>
      )}
    </div>
  );
}
