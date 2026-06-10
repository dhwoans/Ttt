import { useGameStore } from "@/stores/useGameStore";

/**
 * 타임아웃 처리 훅
 * 이제 isTimeOver가 없어지고 timeoutBy만 저장한다.
 */
export function useGameTimeout(currentPlayerNickname: string) {
  const setTimeoutBy = useGameStore((state) => state.setTimeoutBy);

  const handleTimeout = () => {
    setTimeoutBy(currentPlayerNickname);
  };

  return { handleTimeout };
}
