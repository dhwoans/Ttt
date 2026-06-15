import { useEffect, useMemo } from "react";
import { animalList } from "@/shared/constants/avatarCandidates";
import { useUserStore } from "@/stores/useUserStore";
import { useRoomStore } from "@/stores/useRoomStore";

/**
 * 마운트 시 현재 사용자를 첫 번째 플레이어로 초기화하는 훅
 */
export function useInitializeMe() {
  const currentUser = useUserStore((state) => state.currentUser);
  const addPlayerInfo = useRoomStore((state) => state.addPlayerInfo);

  const myInfo = useMemo(() => {
    const avatarIndex = currentUser?.avatarIndex ?? 3;
    const selectedAvatar =
      animalList[avatarIndex] ?? animalList[3] ?? animalList[0];

    return {
      nickname: currentUser?.nickname ?? "플레이어",
      avatar: selectedAvatar[0],
      imageSrc: selectedAvatar[2],
      userId: currentUser?.userId ?? "",
      isReady: false,
    };
  }, [currentUser]);

  useEffect(() => {
    console.log("[Room] Initializing me as first player:", myInfo.nickname);
    addPlayerInfo(myInfo);
  }, [myInfo, addPlayerInfo]);
}
