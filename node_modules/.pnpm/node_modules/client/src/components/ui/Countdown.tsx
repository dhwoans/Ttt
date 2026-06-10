import { useCountdown } from "@/shared/hooks/useCountdown";

interface CountdownProps {
  durationMs: number;
  onComplete?: () => void;
  autoStart?: boolean;
  className?: string;
  initialStartTime?: number; // 타이머 시작 시각 (ms, Date.now())
}

export const Countdown = ({
  durationMs,
  onComplete,
  autoStart = true,
  className,
  initialStartTime,
}: CountdownProps) => {
  const remaining = useCountdown(
    durationMs,
    onComplete,
    autoStart,
    initialStartTime,
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
