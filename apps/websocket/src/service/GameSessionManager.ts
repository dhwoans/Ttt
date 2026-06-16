import { Ttt, PlayingState } from "@ttt/core";
import type { Action, SuccessResponse, FailureResponse } from "@ttt/core";
import type { RoomId, UserId } from "../type/socket.js";

class GameSessionManager {
  private readonly sessions = new Map<RoomId, Ttt>();

  createSession(roomId: RoomId): Ttt {
    const game = new Ttt();
    game.tree.game.roomId = roomId;
    this.sessions.set(roomId, game);
    return game;
  }

  getGameState(roomId: RoomId): SuccessResponse<Ttt> | FailureResponse {
    const game = this.sessions.get(roomId);
    if (!game) {
      return {
        success: false,
        message: `Game session not found: roomId=${roomId}`,
      };
    }

    return { success: true, message: game };
  }

  addPlayer(
    roomId: RoomId,
    userId: UserId,
    nickname: string,
    avatar?: string,
  ): SuccessResponse | FailureResponse {
    const game = this.sessions.get(roomId);
    if (!game) return { success: false, message: "Session not found" };

    game.addPlayer(userId, nickname, avatar);
    return { success: true };
  }

  removePlayer(
    roomId: RoomId,
    userId: UserId,
  ): SuccessResponse | FailureResponse {
    const game = this.sessions.get(roomId);
    if (!game) return { success: false, message: "Session not found" };

    game.removePlayer(userId);
    return { success: true };
  }

  readyPlayer(
    roomId: RoomId,
    userId: UserId,
    isReady: boolean,
  ): SuccessResponse | FailureResponse {
    const game = this.sessions.get(roomId);
    if (!game) return { success: false, message: "Session not found" };

    return game.processAction({
      type: "READY",
      userId,
      nickname: "unknown", // Core finds player by userId
      isReady,
    }) as SuccessResponse<void> | FailureResponse;
  }

  startGame(
    roomId: RoomId,
    _playerIds: UserId[],
  ): SuccessResponse | FailureResponse {
    const game = this.sessions.get(roomId);
    if (!game) return { success: false, message: "Session not found" };

    const result = game.processAction({
      type: "START",
      userId: "system",
      nickname: "system",
    });

    if (!result.success) return result as FailureResponse;

    const state = game.getState();
    if (state.game.status !== "PLAYING") {
      return {
        success: false,
        message: `Failed to start game: invalid state ${state.game.status}`,
      };
    }

    return { success: true };
  }

  deleteGame(roomId: RoomId): SuccessResponse | FailureResponse {
    this.sessions.delete(roomId);
    return { success: true };
  }

  applyMove(
    roomId: RoomId,
    userId: UserId,
    nickname: string,
    move: number,
  ): SuccessResponse | FailureResponse {
    const game = this.sessions.get(roomId);
    if (!game) {
      return {
        success: false,
        message: `Game instance not found: roomId=${roomId}`,
      };
    }

    return game.processAction({
      type: "MOVE",
      userId,
      nickname,
      move,
    }) as SuccessResponse<void> | FailureResponse;
  }

  applyTimeout(
    roomId: RoomId,
    userId: UserId,
    nickname: string,
  ): SuccessResponse | FailureResponse {
    const game = this.sessions.get(roomId);
    if (!game) return { success: false, message: "Session not found" };

    return game.processAction({
      type: "TIMEOUT",
      userId,
      nickname,
    }) as SuccessResponse<void> | FailureResponse;
  }
}

export default GameSessionManager;
