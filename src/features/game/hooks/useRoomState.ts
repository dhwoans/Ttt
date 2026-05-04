import { useState, useEffect, useMemo } from "react";
import { animalList } from "@/shared/constants/avatarCandidates";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import type { RoomPhase } from "../types/TicTacToeGameTypes";

// 방 화면에서 공유하는 기본 상태 관리
// 내 플레이어 정보, 현재 phase를 초기화 및 저장.
export function useRoomState() {
  const saved = localStorage.getItem("gameState");
  const myPlayer = useTicTacToeGameStore((state) => state.myPlayer);
  const myInfo = useMemo(() => {
    const avatarIndex = myPlayer?.avatarIndex ?? 3;
    const selectedAvatar =
      animalList[avatarIndex] ?? animalList[3] ?? animalList[0];

    return {
      nickname: myPlayer?.nickname ?? "플레이어",
      avatar: selectedAvatar[0],
      imageSrc: selectedAvatar[2],
      userId: myPlayer?.userId,
    };
  }, [myPlayer]);

  const playersInfos = useTicTacToeGameStore((state) => state.playersInfos);
  const setPlayersInfos = useTicTacToeGameStore(
    (state) => state.setPlayersInfos,
  );

  // 마운트 시 나 자신을 첫 번째 플레이어로 초기화
  useEffect(() => {
    setPlayersInfos([myInfo]);
  }, [myInfo, setPlayersInfos]);

  const [phase, setPhase] = useState<RoomPhase>(() => {
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.phase === "playing") return "playing";
      } catch {}
    }
    return "ready";
  });

  return {
    playersInfos,
    phase,
    setPhase,
  };
}
