import { useState, useEffect, useMemo } from "react";
import { animalList } from "@/shared/constants/avatarCandidates";
import { useUserStore } from "@/stores/useUserStore";
import { useRoomStore } from "@/stores/useRoomStore";

type RoomPhase = "ready" | "bridge" | "playing";

// 방 화면에서 공유하는 기본 상태 관리
// 내 플레이어 정보, 현재 phase를 초기화 및 저장.
export function useRoomState() {
  const saved = localStorage.getItem("gameState");
  const currentUser = useUserStore((state) => state.currentUser);
  const myInfo = useMemo(() => {
    const avatarIndex = currentUser?.avatarIndex ?? 3;
    const selectedAvatar =
      animalList[avatarIndex] ?? animalList[3] ?? animalList[0];

    return {
      nickname: currentUser?.nickname ?? "플레이어",
      avatar: selectedAvatar[0],
      imageSrc: selectedAvatar[2],
      userId: currentUser?.userId,
      isReady: false,
    };
  }, [currentUser]);

  const playersInfos = useRoomStore((state) => state.playersInfos);
  const setPlayersInfos = useRoomStore((state) => state.setPlayersInfos);

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
