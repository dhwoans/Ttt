import { useJoinRoom } from "./useJoinRoom";
import { useRoomStore } from "@/stores/useRoomStore";

/**
 * API 서버로 게임 티켓 요청
 */
export function useGetGameTicket() {
  const setGameServerConnection = useRoomStore(
    (state) => state.setGameServerConnection,
  );

  const getGameTicket = async () => {
    // API 서버로 게임 티켓 요청
    const response = await useJoinRoom();

    if (response?.success && response?.data) {
      // 응답 포맷: data = { success, ticket, gameServerUrl }
      const apiResponse = response.data;
      const gameServerUrl = apiResponse.gameServerUrl;
      const ticket = apiResponse.ticket;

      if (gameServerUrl && ticket) {
        setGameServerConnection({ gameServerUrl, gameTicket: ticket });

        return {
          success: true,
          gameServerUrl,
          ticket,
        };
      }
    }

    return { success: false };
  };

  return { getGameTicket };
}
