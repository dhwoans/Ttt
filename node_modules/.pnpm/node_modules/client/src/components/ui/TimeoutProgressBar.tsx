import { useState, useEffect, useRef } from "react";
import { eventManager } from "@/shared/services/EventManager";
import { useRoomStore } from "@/stores/useRoomStore";

interface TimeoutProgressBarProps {
  /** 수신할 이벤트 이름 (기본값: "READY_TIMEOUT_STARTED") */
  eventName?: string;
  /** 취소 이벤트 이름 (기본값: "READY_TIMEOUT_CANCELED") */
  cancelEventName?: string;
  /** 화면 상단에 표시할 라벨 (기본값: 미표시) */
  label?: string;
  /** 타임아웃 완료 시 콜백 */
  onTimeout?: () => void;
}

/**
 * 화면 상단에 바 형태로 표시되는 타임아웃 프로그레스 바
 * 다양한 이벤트를 받아서 재활용 가능함
 *
 * @example
 * ```tsx
 * // Ready 페이지
 * <TimeoutProgressBar
 *   eventName="READY_TIMEOUT_STARTED"
 *   label="준비 제한 시간"
 * />
 *
 * // 다른 페이지
 * <TimeoutProgressBar
 *   eventName="CUSTOM_TIMEOUT"
 *   onTimeout={() => console.log('timeout')}
 * />
 * ```
 */
export function TimeoutProgressBar({
  eventName = "READY_TIMEOUT_STARTED",
  cancelEventName = "READY_TIMEOUT_CANCELED",
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
  const isCountingDownRef = useRef(false);

  useEffect(() => {
    isCountingDownRef.current = !!timeoutMs && remainingMs > 0;
  }, [timeoutMs, remainingMs]);

  useEffect(() => {
    if (eventName !== "READY_TIMEOUT_STARTED") {
      return;
    }

    if (!readyTimeoutSnapshot) {
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
  }, [eventName, readyTimeoutSnapshot, setReadyTimeoutSnapshot]);

  // 타임아웃 이벤트 수신
  useEffect(() => {
    const handleTimeoutStarted = (data: any) => {
      console.log(`[TimeoutProgressBar] ${eventName} 수신:`, data);

      if (isCountingDownRef.current) {
        return;
      }

      const nextTimeoutMs = Number(data?.timeoutMs);
      if (!Number.isFinite(nextTimeoutMs) || nextTimeoutMs <= 0) {
        return;
      }

      setTimeoutMs(nextTimeoutMs);
      setRemainingMs(nextTimeoutMs);

      if (eventName === "READY_TIMEOUT_STARTED") {
        setReadyTimeoutSnapshot({
          timeoutMs: nextTimeoutMs,
          startedAt: Date.now(),
        });
      }
    };

    eventManager.on(eventName, handleTimeoutStarted);
    return () => {
      eventManager.off(eventName, handleTimeoutStarted);
    };
  }, [eventName, setReadyTimeoutSnapshot]);

  // 취소 이벤트 수신 시 카운트다운 즉시 종료
  useEffect(() => {
    const handleTimeoutCanceled = (data: any) => {
      console.log(`[TimeoutProgressBar] ${cancelEventName} 수신:`, data);
      setTimeoutMs(null);
      setRemainingMs(0);
      if (cancelEventName === "READY_TIMEOUT_CANCELED") {
        setReadyTimeoutSnapshot(null);
      }
    };

    eventManager.on(cancelEventName, handleTimeoutCanceled);
    return () => {
      eventManager.off(cancelEventName, handleTimeoutCanceled);
    };
  }, [cancelEventName, setReadyTimeoutSnapshot]);

  // 카운트다운 타이머
  useEffect(() => {
    if (!timeoutMs || remainingMs <= 0) return;

    const interval = setInterval(() => {
      setRemainingMs((prev) => {
        const next = prev - 100; // 100ms 단위 업데이트로 부드러운 애니메이션
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
