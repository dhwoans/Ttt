import { useEffect, useState } from "react";

interface UseAvatarRandomizeProps {
  enabled?: boolean;
  itemCount: number;
}

export default function useAvatarRandomize({
  enabled,
  itemCount,
}: UseAvatarRandomizeProps) {
  const [randomIndex, setRandomIndex] = useState(0);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!enabled || hasAnimated || itemCount <= 0) {
      return;
    }

    setIsRandomizing(true);
    let count = 0;
    const interval = setInterval(() => {
      setRandomIndex(Math.floor(Math.random() * itemCount));
      count += 1;

      if (count > 5) {
        clearInterval(interval);
        setIsRandomizing(false);
        setHasAnimated(true);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [enabled, hasAnimated, itemCount]);

  return {
    isRandomizing,
    randomIndex,
  };
}
