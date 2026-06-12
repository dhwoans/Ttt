import { useEffect } from "react";
import { toast } from "react-toastify";
import { eventManager } from "@/shared/services/EventManager";
import { animalList } from "@/shared/constants/avatarCandidates";
import { useRoomStore } from "@/stores/useRoomStore";
import type { PlayerJoinedEvent, ExistingPlayersEvent } from "@ttt/contract";

/**
 * 멀티플레이 플레이어 목록 관리
 * - store의 playersInfos를 업데이트
 * - EXISTING_PLAYERS 이벤트 처리
 * - PLAYER_JOINED 이벤트 처리
 */
export function useMultiplayerPlayers() {
  const addPlayerInfo = useRoomStore((state) => state.addPlayerInfo);
  const setPlayersInfos = useRoomStore((state) => state.setPlayersInfos);
  const updatePlayerReadyStatus = useRoomStore(
    (state) => state.updatePlayerReadyStatus,
  );
  // EXISTING_PLAYERS 이벤트 처리
  useEffect(() => {
    const handleExistingPlayers = (data: ExistingPlayersEvent) => {
      console.log("[room] EXISTING_PLAYERS 이벤트 수신:", data.players);

      const nextPlayers = data.players.map((player) => {
        const found = animalList.find((animal) => animal[0] === player.avatar);
        return {
          nickname: player.nickname,
          avatar: player.avatar ?? "",
          imageSrc: found ? found[2] : "",
          userId: player.userId,
          isReady: player.isReady,
        };
      });
      setPlayersInfos(nextPlayers);
    };

    eventManager.on("EXISTING_PLAYERS", handleExistingPlayers);
    return () => {
      console.log("[room] EXISTING_PLAYERS 리스너 제거");
      eventManager.off("EXISTING_PLAYERS", handleExistingPlayers);
    };
  }, [setPlayersInfos]);

  useEffect(() => {
    const handlePlayerJoined = (data: PlayerJoinedEvent) => {
      console.log("[room] 새 플레이어 입장:", data.player);
      toast.info(`${data.player.nickname}님이 들어왔습니다!`);

      const found = animalList.find(
        (animal) => animal[0] === data.player.avatar,
      );
      addPlayerInfo({
        nickname: data.player.nickname,
        avatar: data.player.avatar ?? "",
        imageSrc: found ? found[2] : "",
        userId: data.player.userId,
        isReady: data.player.isReady,
      });

      updatePlayerReadyStatus(data.player.userId, data.player.isReady);
    };

    eventManager.on("PLAYER_JOINED", handlePlayerJoined);
    return () => {
      console.log("[room] PLAYER_JOINED 리스너 제거");
      eventManager.off("PLAYER_JOINED", handlePlayerJoined);
    };
  }, [addPlayerInfo, updatePlayerReadyStatus]);
}
