import { gameSocketManager } from "@/shared/utils/SocketManager";
import type { MoveEventPayload } from "@share";

/**
 * 플레이어의 이동(좌표) 정보를 서버에 전송하는 훅
 */
export function useSendPlayerMove() {
  const sendMove = (row: number, col: number) => {
    const payload: MoveEventPayload = { move: row * 3 + col };
    gameSocketManager.sendMessage("MOVE", payload);
  };

  return { sendMove };
}
