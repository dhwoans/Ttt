import type RoomService from "../RoomService.js";
import type GameSessionManager from "../GameSessionManager.js";
import type SocketMessage from "../../dtos/SocketMessage.dto.js";
import type { Action, SuccessResponse, FailureResponse } from "@ttt/core";
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

    const action: Action = {
      type: type as any,
      userId,
      move: parseInt(index!),
      nickname: sender,
    };
    const applyResult = this.gameSessionManager.applyMove(
      roomId!,
      userId,
      sender,
      parseInt(index!),
    );
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
    const roomResult = this.roomService.getRoomData(roomId!);
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
    state: any, // Using any briefly to avoid complex type mapping here, but correctly accessing tree properties
  ): void {
    let nextMessage: SocketMessage;
    if (state.game.status === "GAME_OVER") {
      const winner: string =
        state.game.winner === -2 ? "DRAW" : state.players[state.game.winner].id;
      nextMessage = {
        type: state.game.status,
        message: [winner],
        sender: "system",
      };
      this.gameSessionManager.deleteGame(roomId);
      this.resetReady(roomId);
    } else {
      nextMessage = {
        type: state.game.status,
        message: [state.players[state.game.currentTurn % 2].id],
        sender: "system",
      };
    }

    eventshandler.emit(state.game.status, {
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

    for (const player of roomResult.message.tree.players) {
      this.roomService.readyPlayer(roomId, player.id, false);
    }
  }
}

export default LegacyWsGameService;
