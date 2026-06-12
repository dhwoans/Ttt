import { useCallback } from "react";
import { useGetGameTicket } from "./useGetGameTicket";
import { useConnectGameServer } from "./useConnectGameServer";

export function useEnterMultiMode() {
  const { getGameTicket } = useGetGameTicket();
  const { connectGameServer } = useConnectGameServer();

  const handleMultiMode = useCallback(async () => {
    try {
      // API에서 ticket 받기
      const response = await getGameTicket();
      console.log("[multi] getGameTicket response:", response);

      if (response.success) {
        console.log("[multi] gameServerUrl received:", response.gameServerUrl);
        console.log("[multi] ticket received:", response.ticket);

        // ticket으로 게임 서버 연결
        connectGameServer(response.gameServerUrl!, response.ticket!);
      } else {
        console.error("[multi] 입장 실패");
      }
    } catch (error) {
      console.error("[multi] 연결 중 문제 발생:", error);
    }
  }, [getGameTicket, connectGameServer]);

  return { handleMultiMode };
}