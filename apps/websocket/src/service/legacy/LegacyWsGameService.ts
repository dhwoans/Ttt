import type RoomService from "../RoomService.js";
import type GameSessionManager from "../GameSessionManager.js";
import type SocketMessage from "../../dtos/SocketMessage.dto.js";
import type Action from "../../dtos/Action.dto.js";
import type { SuccessResponse } from "../../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../../dtos/FailureResponse.dto.js";
import {
  eventshandler,
  EVENT_LIST,
  EMIT_MODES,
} from "../../utils/eventhandler.js";
import type { RoomId, UserId } from "../../type/socket.js";

class LegacyWsGameService {
  constructor(
    private readonly gameSessionManager: GameSessionManager,
    private readonly roomService: RoomService,
  ) {}

  processMove(
    rawMessage: SocketMessage,
    userId: UserId,
  ): SuccessResponse<void> | FailureResponse {
    const { type, message, sender } = rawMessage;
    const [roomId, index] = message;

    const action: Action = { type, move: parseInt(index!), nickname: sender };
    const applyResult = this.gameSessionManager.applyMove(roomId!, action);
    if (!applyResult.success) {
      const errorPayload: SocketMessage = {
        type: "ERROR",
        message: [applyResult.message],
        sender: "system",
      };
      eventshandler.emit(EVENT_LIST.ERROR, {
        mode: EMIT_MODES.UNICAST,
        targetId: userId,
        payload: errorPayload,
      });
      return applyResult;
    }

    const gameStateResult = this.roomService.getGameState(roomId!);
    if (!gameStateResult.success || !gameStateResult.message) {
      return { success: false, message: "게임 상태 얻기 실패" };
    }

    const state = gameStateResult.message.getState();
    const roomResult = this.roomService.checkRoom(roomId!);
    if (!roomResult.success) {
      return { success: false, message: roomResult.message };
    }

    this.broadcastMove(roomId!, sender, index!.toString());
    this.broadcastNextGameState(roomId!, state);

    return { success: true };
  }

  private broadcastMove(roomId: RoomId, sender: string, index: string): void {
    const moveMessage: SocketMessage = {
      type: "MOVE",
      message: [sender, index],
      sender: "system",
    };
    eventshandler.emit(EVENT_LIST.MOVE, {
      mode: EMIT_MODES.BROADCAST,
      roomId,
      payload: moveMessage,
    });
  }

  private broadcastNextGameState(
    roomId: RoomId,
    state: {
      board: Array<string>;
      winner: number;
      status: string;
      players: Array<string>;
      currentTurn: number;
    },
  ): void {
    let nextMessage: SocketMessage;
    if (state.status === "GAME_OVER") {
      const winner: string =
        state.winner === -2 ? "DRAW" : state.players[state.winner]!;
      nextMessage = { type: state.status, message: [winner], sender: "system" };
      this.gameSessionManager.deleteGame(roomId);
      this.resetReady(roomId);
    } else {
      nextMessage = {
        type: state.status,
        message: [state.players[state.currentTurn % 2]!.toString()],
        sender: "system",
      };
    }

    eventshandler.emit(state.status, {
      mode: EMIT_MODES.BROADCAST,
      roomId,
      payload: nextMessage,
    });
  }

  private resetReady(roomId: RoomId) {
    const roomResult = this.roomService.getRoomData(roomId);
    if (!roomResult.success || !roomResult.message) {
      return;
    }

    for (const player of roomResult.message.getAllPlayersData()) {
      this.roomService.readyPlayer(roomId, player.userId, false);
    }
  }
}

export default LegacyWsGameService;
