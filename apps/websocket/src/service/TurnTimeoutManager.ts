import type RoomService from "./RoomService.js";
import type GameEventPublisher from "../routes/socketio/GameEventPublisher.js";
import { reconstructBoard } from "@ttt/core";

export class TurnTimeoutManager {
  private readonly timeoutMs = 10000;
  private readonly timeouts = new Map<string, NodeJS.Timeout>();
  private readonly expiresAt = new Map<string, number>();
  private readonly tokens = new Map<string, number>();

  constructor(
    private readonly roomService: RoomService,
    private readonly publisher: GameEventPublisher,
  ) {}

  start(roomId: string) {
    const gameStateResult = this.roomService.getGameState(roomId);
    if (!gameStateResult.success || !gameStateResult.message) {
      this.clear(roomId);
      return;
    }

    const state = gameStateResult.message.getState();
    if (state.game.status !== "PLAYING" || state.players.length === 0) {
      this.clear(roomId);
      return;
    }

    const currentTurnPlayerId =
      state.players[state.game.currentTurn % state.players.length]!.id;

    const existing = this.timeouts.get(roomId);
    if (existing) {
      clearTimeout(existing);
      this.timeouts.delete(roomId);
      this.expiresAt.delete(roomId);
    }

    const token = (this.tokens.get(roomId) ?? 0) + 1;
    this.tokens.set(roomId, token);

    const expiresAt = Date.now() + this.timeoutMs;
    const timeout = setTimeout(() => {
      void this.handleTimeout(roomId, token);
    }, this.timeoutMs);

    this.timeouts.set(roomId, timeout);
    this.expiresAt.set(roomId, expiresAt);
    this.publisher.emitTurnTimeoutStarted(roomId, {
      timeoutMs: this.timeoutMs,
      currentTurnPlayerId,
    });
  }

  clear(roomId: string) {
    const timeout = this.timeouts.get(roomId);
    if (timeout) {
      clearTimeout(timeout);
    }

    this.timeouts.delete(roomId);
    this.expiresAt.delete(roomId);
    this.tokens.delete(roomId);
  }

  getExpiresAt(roomId: string): number | undefined {
    return this.expiresAt.get(roomId);
  }

  private async handleTimeout(roomId: string, token: number): Promise<void> {
    const currentToken = this.tokens.get(roomId);
    if (currentToken !== token) {
      return;
    }

    this.timeouts.delete(roomId);
    this.expiresAt.delete(roomId);

    const moveResult = this.roomService.getGameState(roomId);
    if (!moveResult.success || !moveResult.message) {
      this.clear(roomId);
      return;
    }

    const game = moveResult.message;
    const state = game.getState();

    if (state.game.status !== "PLAYING" || state.players.length === 0) {
      this.clear(roomId);
      return;
    }

    const currentPlayerId =
      state.players[state.game.currentTurn % state.players.length]!.id;

    const roomResult = this.roomService.getRoomData(roomId);
    if (!roomResult.success || !roomResult.message) {
      this.clear(roomId);
      return;
    }

    const playerResult = roomResult.message
      .getAllPlayersData()
      .find((player) => player.userId === currentPlayerId);

    const nickname = playerResult?.nickname ?? "system";
    const avatar = playerResult?.avatar;

    const actionResult = game.processAction({
      type: "TIMEOUT",
      nickname,
      ...(avatar ? { symbol: avatar } : {}),
    });

    if (!actionResult.success) {
      this.start(roomId);
      return;
    }

    const updatedState = game.getState();
    const lastMove =
      updatedState.game.history[updatedState.game.history.length - 1];
    const moveIndex = lastMove?.index ?? 0;

    this.publisher.emitMoveMade(roomId, {
      userId: currentPlayerId,
      move: moveIndex,
      isAuto: true,
    });

    if (updatedState.game.status === "GAME_OVER") {
      let winnerUserId: string | null = null;
      let result: "win" | "draw" = "draw";

      if (
        updatedState.game.winner >= 0 &&
        updatedState.game.winner < updatedState.players.length
      ) {
        winnerUserId =
          updatedState.players[updatedState.game.winner]!.id || null;
        result = "win";
      }

      this.publisher.emitGameOver(roomId, {
        result,
        winner: winnerUserId,
        winnerIndex: updatedState.game.winner,
        board: reconstructBoard(updatedState.game.history),
      });
      this.clear(roomId);
      return;
    }

    const nextPlayerId =
      updatedState.players[
        updatedState.game.currentTurn % updatedState.players.length
      ]!.id;
    this.publisher.emitNextTurn(roomId, {
      currentTurn: updatedState.game.currentTurn,
      nextPlayerId,
    });

    this.start(roomId);
  }
}
