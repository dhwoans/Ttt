import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gameSocketManager } from "@/shared/services/SocketManager";
import { toast } from "react-toastify";
import { ROUTES } from "@/shared/constants/routes";
import { useUserStore } from "@/stores/useUserStore";
import { useGameStore } from "@/stores/useGameStore";
import { eventManager } from "@/shared/services/EventManager";

/**
 * 게임 서버 연결 (ticket 기반 인증)
 * API에서 받은 ticket으로 게임 서버에 접속
 */
export function useConnectGameServer() {
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);
  const setRoomId = useGameStore((state) => state.setRoomId);

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

      // 서버에서 roomId 받기 (연결 전에 리스너를 먼저 등록하여 신호 누락 방지)
      const handleRoomAssigned = (data: any) => {
        console.log("[multi] ROOM_ASSIGNED received:", data);
        const assignedRoomId = data.roomId;
        setRoomId(assignedRoomId);

        // 게임방으로 이동
        toast("🎟️ 입장권 내는 중...");
        setTimeout(() => {
          navigate(ROUTES.game.room(assignedRoomId));
        }, 1500);
      };

      // 한 번만 실행되도록 설정
      eventManager.once("ROOM_ASSIGNED", handleRoomAssigned);

      // ticket API가 반환한 서버 URL을 우선 사용하고, 없으면 same-origin을 사용한다.
      gameSocketManager.connect(userId, nickname, gameServerUrl || "/", {
        ticket,
      });
    },
    [currentUser, navigate, setRoomId],
  );

  return { connectGameServer };
}
