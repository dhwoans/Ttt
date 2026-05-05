import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gameSocketManager } from "@/shared/utils/SocketManager";
import { toast } from "react-toastify";
import { ROUTES } from "@/shared/constants/routes";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { eventManager } from "@/shared/utils/EventManager";

/**
 * 게임 서버 연결 (ticket 기반 인증)
 * API에서 받은 ticket으로 게임 서버에 접속
 */
export function useConnectGameServer() {
  const navigate = useNavigate();
  const myPlayer = useTicTacToeGameStore((state) => state.myPlayer);
  const setRoomId = useTicTacToeGameStore((state) => state.setRoomId);

  const connectGameServer = useCallback(
    (gameServerUrl: string, ticket: string) => {
      const nickname = myPlayer?.nickname;
      const userId = myPlayer?.userId;

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

      // Same-origin 연결 (nginx를 통해 backend로 프록시)
      // gameServerUrl 무시하고 현재 origin 사용
      gameSocketManager.connect(userId, nickname, "/", { ticket });

      // 서버에서 roomId 받기
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
    },
    [myPlayer, navigate, setRoomId],
  );

  return { connectGameServer };
}
