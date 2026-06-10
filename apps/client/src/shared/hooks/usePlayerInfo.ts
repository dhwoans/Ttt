import { useMemo } from "react";
import { useUserStore } from "@/stores/useUserStore";

export interface PlayerInfo {
  nickname: string;
  avatarIndex: number;
}

export function usePlayerInfo(): PlayerInfo {
  const currentUser = useUserStore((state) => state.currentUser);

  return useMemo<PlayerInfo>(() => {
    return {
      nickname: currentUser?.nickname || "플레이어",
      avatarIndex: currentUser?.avatarIndex ?? 3,
    };
  }, [currentUser]);
}
