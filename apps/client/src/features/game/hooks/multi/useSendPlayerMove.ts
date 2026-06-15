import { gameSocketManager } from "@/shared/services/SocketManager";
import type { MoveEventPayload } from "@ttt/contract";

/**
 * 플레이어의 이동(인덱스) 정보를 서버에 전송하는 훅
 */
export function useSendPlayerMove() {
  const sendMove = (index: number) => {
    const payload: MoveEventPayload = { move: index };
    gameSocketManager.sendMessage("MOVE", payload);
  };

  return { sendMove };
}
