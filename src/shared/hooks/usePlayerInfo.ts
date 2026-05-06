import { useMemo } from "react";
import { useUserStore } from "@/stores/useUserStore";

export interface PlayerInfo {
  nickname: string;
  avatarIndex: number;
}

export function usePlayerInfo(): PlayerInfo {
  const myPlayer = useUserStore((state) => state.myPlayer);

  return useMemo<PlayerInfo>(() => {
    return {
      nickname: myPlayer?.nickname || "플레이어",
      avatarIndex: myPlayer?.avatarIndex ?? 3,
    };
  }, [myPlayer]);
}
