import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gameSocketManager } from "@/shared/services/SocketManager";
import { useUserStore } from "@/stores/useUserStore";

/**
 * 게임 서버 연결 (ticket 기반 인증)
 * API에서 받은 ticket으로 게임 서버에 접속
 */
export function useConnectGameServer() {
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);

  const connectGameServer = useCallback(
    (gameServerUrl: string, ticket: string) => {
      const nickname = currentUser?.nickname;
      const userId = currentUser?.userId;

      if (!userId || !nickname || !ticket) {
        console.error("userId or nickname or ticket not found");
        return;
      }

      console.log("[multi] connectGameServer called", {
        gameServerUrl,
        userId,
        nickname,
        ticket,
      });

      // ticket API가 반환한 서버 URL을 우선 사용하고, 없으면 same-origin을 사용한다.
      gameSocketManager.connect(userId, nickname, gameServerUrl || "/", {
        ticket,
      });
    },
    [currentUser],
  );

  return { connectGameServer };
}
