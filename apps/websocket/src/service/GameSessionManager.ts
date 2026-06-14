import { Ttt, PlayingState } from "@ttt/core";
import type { Action, SuccessResponse, FailureResponse } from "@ttt/core";
import type { RoomId, UserId } from "../type/socket.js";

class GameSessionManager {
  private readonly games = new Map<RoomId, Ttt>();

  getGameState(roomId: RoomId): SuccessResponse<Ttt> | FailureResponse {
    const game = this.games.get(roomId);
    if (!game) {
      return {
        success: false,
        message: `Game state not found: roomId=${roomId}`,
      };
    }

    return { success: true, message: game };
  }

  startGame(
    roomId: RoomId,
    playerIds: UserId[],
  ): SuccessResponse | FailureResponse {
    const game = new Ttt();
    this.games.set(roomId, game);

    game.setPlayers(playerIds);
    game.changeState(new PlayingState());
    const state = game.getState();

    if (state.status !== "PLAYING") {
      return {
        success: false,
        message: `Failed to start game: invalid state ${state.status}`,
      };
    }

    if (state.players.length !== 2) {
      return {
        success: false,
        message: `Failed to start game: insufficient players (${state.players.length}/2)`,
      };
    }

    return { success: true };
  }

  deleteGame(roomId: RoomId): SuccessResponse | FailureResponse {
    this.games.delete(roomId);
    if (this.games.get(roomId)) {
      return { success: false, message: "게임 삭제 실패" };
    }

    return { success: true };
  }

  applyMove(roomId: RoomId, action: Action): SuccessResponse | FailureResponse {
    const game = this.games.get(roomId);
    if (!game) {
      return {
        success: false,
        message: `Game instance not found: roomId=${roomId}`,
      };
    }

    const state = game.getState();
    if (state.status !== "PLAYING") {
      return {
        success: false,
        message: "Game is not in PLAYING state",
      };
    }

    return game.processAction(action) as
      | SuccessResponse<void>
      | FailureResponse;
  }
}

export default GameSessionManager;


