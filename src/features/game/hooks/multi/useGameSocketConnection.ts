import { useEffect } from "react";
import { gameSocketManager } from "@/shared/utils/SocketManager";
import { useUserStore } from "@/stores/useUserStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useGameStore } from "@/stores/useGameStore";

/**
 * 게임 소켓 연결을 관리하는 훅
 * 컴포넌트 마운트 시 연결, 언마운트 시 종료
 */
export function useGameSocketConnection(roomId: string) {
  const myPlayer = useUserStore((state) => state.myPlayer);
  const gameServerUrl = useRoomStore((state) => state.gameServerUrl);
  const gameTicket = useRoomStore((state) => state.gameTicket);
  const setRoomId = useGameStore((state) => state.setRoomId);

  useEffect(() => {
    const userId = myPlayer?.userId;
    const userNickname = myPlayer?.nickname;
    const socket = gameSocketManager.getSocket();

    // URL 파라미터를 room 진입의 단일 소스로 사용한다.
    setRoomId(roomId);

    if (socket?.connected) {
      return () => {
        gameSocketManager.disconnect();
      };
    }

    if (roomId && userId && userNickname) {
      gameSocketManager.connect(
        userId,
        userNickname,
        gameServerUrl || "/room",
        {
          roomId,
          ticket: gameTicket ?? undefined,
        },
      );
    }

    // 클린업
    return () => {
      gameSocketManager.disconnect();
    };
  }, [gameServerUrl, gameTicket, myPlayer, roomId, setRoomId]);

  const disconnect = () => {
    gameSocketManager.disconnect();
  };

  const getSocket = () => gameSocketManager.getSocket();

  return { disconnect, getSocket };
}
