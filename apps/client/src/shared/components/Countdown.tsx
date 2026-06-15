import { useCountdown } from "@/shared/hooks/useCountdown";

interface CountdownProps {
  durationMs: number;
  initialStartTime: number; // 타이머 시작 시각 (ms, Date.now())
  onComplete?: () => void;
  className?: string;
}

export const Countdown = ({
  durationMs,
  initialStartTime,
  onComplete,
  className,
}: CountdownProps) => {
  const remaining = useCountdown(
    durationMs,
    initialStartTime,
    onComplete,
  );

  const displayText = Math.ceil(remaining / 1000);
  const isWarning = remaining < Math.round(durationMs / 3);
  const resolvedStyle = isWarning ? { color: "#ef4444" } : undefined;

  return (
    <span className={className} style={resolvedStyle}>
      {displayText}
    </span>
  );
};

export default Countdown;
