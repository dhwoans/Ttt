import { useMemo } from "react";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

export interface PlayerInfo {
  nickname: string;
  avatarIndex: number;
}

export function usePlayerInfo(): PlayerInfo {
  const myPlayer = useTicTacToeGameStore((state) => state.myPlayer);

  return useMemo<PlayerInfo>(() => {
    return {
      nickname: myPlayer?.nickname || "플레이어",
      avatarIndex: myPlayer?.avatarIndex ?? 3,
    };
  }, [myPlayer]);
}
