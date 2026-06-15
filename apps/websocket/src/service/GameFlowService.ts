import type { Socket } from "socket.io";
import type RoomService from "./RoomService.js";
import SocketErrorResponder from "../routes/socketio/SocketErrorResponder.js";
import GameEventPublisher from "../routes/socketio/GameEventPublisher.js";
import { reconstructBoard } from "@ttt/core";

/**
 * 게임 진행 흐름(READY, MOVE, 상태 전이)을 오케스트레이션하는 서비스.
 *
 * 도메인 처리 결과를 받아 적절한 송신 이벤트를 발행하며,
 * Socket 핸들러가 비즈니스 규칙을 직접 가지지 않도록 분리한다.
 */
class GameFlowService {
  private readonly readyTimeoutMs = 20000;
  private readonly readyTimeouts = new Map<string, NodeJS.Timeout>();
  private readonly readyTimeoutExpiresAt = new Map<string, number>();
  private readonly turnTimeoutMs = 10000;
  private readonly turnTimeouts = new Map<string, NodeJS.Timeout>();
  private readonly turnTimeoutExpiresAt = new Map<string, number>();
  private readonly turnTimeoutTokens = new Map<string, number>();

  constructor(
    private readonly roomService: RoomService,
    private readonly errors: SocketErrorResponder,
    private readonly publisher: GameEventPublisher,
  ) {}

  onRoomStateChanged(roomId: string) {
    const roomResult = this.roomService.getRoomData(roomId);
    if (!roomResult.success || !roomResult.message) {
      this.clearReadyTimeout(roomId, "ROOM_UNAVAILABLE");
      this.clearTurnTimeout(roomId);
      return;
    }

    const players = roomResult.message.getAllPlayersData();
    const roomIsFull = roomResult.message.isFull();
    const allReady =
      players.length > 0 && players.every((player) => player.isReady);

    if (!roomIsFull) {
      this.clearReadyTimeout(roomId, "ROOM_NOT_FULL");
      this.clearTurnTimeout(roomId);
      return;
    }

    if (allReady) {
      this.clearReadyTimeout(roomId, "ALL_READY");
      return;
    }

    this.startReadyTimeout(roomId);
  }

  syncReadyTimeoutForSocket(socket: Socket, roomId: string) {
    const expiresAt = this.readyTimeoutExpiresAt.get(roomId);
    if (!expiresAt) {
      return;
    }

    const remainingMs = Math.max(0, expiresAt - Date.now());
    this.publisher.emitReadyTimeoutStartedToSocket(socket, roomId, remainingMs);
  }

  /**
   * READY 변경 처리:
   * - 플레이어 ready 상태 반영
   * - 전원 ready + 정원 충족 시 게임 시작
   * - 게임 시작 후 ready 초기화 및 PLAYING 전송
   */
  handleReady(socket: Socket, data: { isReady: boolean }) {
    const roomId = socket.data.roomId as string | undefined;
    const userId = socket.data.userId as string | undefined;
    const nickname = socket.data.nickname as string | undefined;
    const avatar = socket.data.avatar as string | undefined;

    if (!roomId || !userId || !nickname) {
      this.errors.emit(socket, "Not in a room");
      return;
    }

    const isReady = data?.isReady ?? true;
    const readyResult = this.roomService.readyPlayer(roomId, userId, isReady);

    if (!readyResult.success) {
      this.errors.emit(socket, "Failed to update ready status");
      return;
    }

    this.publisher.emitPlayerReady(roomId, {
      userId,
      nickname,
      ...(avatar ? { avatar } : {}),
      isReady,
    });

    const roomResult = this.roomService.getRoomData(roomId);
    if (!roomResult.success || !roomResult.message) {
      return;
    }

    const players = roomResult.message.getAllPlayersData();
    const allReady =
      players.length > 0 && players.every((player) => player.isReady);
    const roomIsFull = roomResult.message.isFull();

    if (!roomIsFull || !allReady) {
      this.onRoomStateChanged(roomId);
      return;
    }

    this.clearReadyTimeout(roomId, "ALL_READY");

    const startGameResult = this.roomService.gameStart(roomId);
    if (!startGameResult.success) {
      this.publisher.emitRoomError(roomId, "Failed to start game");
      return;
    }

    for (const player of players) {
      const resetReadyResult = this.roomService.readyPlayer(
        roomId,
        player.userId,
        false,
      );
      if (!resetReadyResult.success) {
        continue;
      }

      this.publisher.emitPlayerReady(roomId, {
        userId: player.userId,
        nickname: player.nickname,
        ...(player.avatar ? { avatar: player.avatar } : {}),
        isReady: false,
      });
    }

    const gameStateResult = this.roomService.getGameState(roomId);
    if (!gameStateResult.success || !gameStateResult.message) {
      this.publisher.emitRoomError(roomId, "Failed to get game state");
      return;
    }

    const state = gameStateResult.message.getState();
    const playerIds = state.players.map((p) => p.id);
    this.publisher.emitPlaying(roomId, {
      status: state.game.status as "PLAYING",
      currentTurnPlayerId: playerIds[state.game.currentTurn]!,
      players: playerIds,
    });

    this.startTurnTimeout(roomId);
  }

  /**
   * MOVE 처리:
   * - 입력 검증
   * - 액션 적용
   * - MOVE/NEXT_TURN/GAME_OVER 이벤트 전송
   */
  handleMove(socket: Socket, data: { move: number }) {
    const roomId = socket.data.roomId as string | undefined;
    const userId = socket.data.userId as string | undefined;
    const nickname = socket.data.nickname as string | undefined;

    if (!roomId || !userId || !nickname) {
      this.errors.emit(socket, "Not in a room");
      return;
    }

    if (typeof data?.move !== "number" || data.move < 0 || data.move > 8) {
      this.errors.emit(socket, "Invalid move: must be 0-8");
      return;
    }

    const move = data.move;
    const action = {
      type: "MOVE" as const,
      move,
      nickname,
    };

    const moveResult = this.roomService.getGameState(roomId);
    if (!moveResult.success || !moveResult.message) {
      this.errors.emit(socket, "Game not found");
      return;
    }

    const game = moveResult.message;
    const stateBeforeMove = game.getState();

    if (stateBeforeMove.game.status !== "PLAYING") {
      this.errors.emit(socket, "Game is not in PLAYING state");
      return;
    }

    const currentTurnPlayerId =
      stateBeforeMove.players[
        stateBeforeMove.game.currentTurn % stateBeforeMove.players.length
      ]!.id;
    if (currentTurnPlayerId !== userId) {
      this.errors.emit(socket, "Not your turn");
      return;
    }

    this.clearTurnTimeout(roomId);
    const actionResult = game.processAction(action);

    if (!actionResult.success) {
      this.errors.emit(socket, actionResult.message);
      return;
    }

    const state = game.getState();
    this.publisher.emitMoveMade(roomId, {
      userId,
      move,
      isAuto: false,
    });

    if (state.game.status === "GAME_OVER") {
      this.clearTurnTimeout(roomId);
      let winnerUserId: string | null = null;
      let result: "win" | "draw" = "draw";

      if (state.game.winner >= 0 && state.game.winner < state.players.length) {
        winnerUserId = state.players[state.game.winner]!.id || null;
        result = "win";
      }

      this.publisher.emitGameOver(roomId, {
        result,
        winner: winnerUserId,
        winnerIndex: state.game.winner,
        board: reconstructBoard(state.game.history),
      });
      return;
    }

    const nextPlayerId =
      state.players[state.game.currentTurn % state.players.length]!.id;
    this.publisher.emitNextTurn(roomId, {
      currentTurn: state.game.currentTurn,
      nextPlayerId,
    });

    this.startTurnTimeout(roomId);
  }

  private startTurnTimeout(roomId: string) {
    const gameStateResult = this.roomService.getGameState(roomId);
    if (!gameStateResult.success || !gameStateResult.message) {
      this.clearTurnTimeout(roomId);
      return;
    }

    const state = gameStateResult.message.getState();
    if (state.game.status !== "PLAYING" || state.players.length === 0) {
      this.clearTurnTimeout(roomId);
      return;
    }

    const currentTurnPlayerId =
      state.players[state.game.currentTurn % state.players.length]!.id;

    const existing = this.turnTimeouts.get(roomId);
    if (existing) {
      clearTimeout(existing);
      this.turnTimeouts.delete(roomId);
      this.turnTimeoutExpiresAt.delete(roomId);
    }

    const token = (this.turnTimeoutTokens.get(roomId) ?? 0) + 1;
    this.turnTimeoutTokens.set(roomId, token);

    const expiresAt = Date.now() + this.turnTimeoutMs;
    const timeout = setTimeout(() => {
      void this.handleTurnTimeout(roomId, token);
    }, this.turnTimeoutMs);

    this.turnTimeouts.set(roomId, timeout);
    this.turnTimeoutExpiresAt.set(roomId, expiresAt);
    this.publisher.emitTurnTimeoutStarted(roomId, {
      timeoutMs: this.turnTimeoutMs,
      currentTurnPlayerId,
    });
  }

  private clearTurnTimeout(roomId: string) {
    const timeout = this.turnTimeouts.get(roomId);
    if (timeout) {
      clearTimeout(timeout);
    }

    this.turnTimeouts.delete(roomId);
    this.turnTimeoutExpiresAt.delete(roomId);
    this.turnTimeoutTokens.delete(roomId);
  }

  private async handleTurnTimeout(
    roomId: string,
    token: number,
  ): Promise<void> {
    const currentToken = this.turnTimeoutTokens.get(roomId);
    if (currentToken !== token) {
      return;
    }

    this.turnTimeouts.delete(roomId);
    this.turnTimeoutExpiresAt.delete(roomId);

    const moveResult = this.roomService.getGameState(roomId);
    if (!moveResult.success || !moveResult.message) {
      this.clearTurnTimeout(roomId);
      return;
    }

    const game = moveResult.message;
    const state = game.getState();

    if (state.game.status !== "PLAYING" || state.players.length === 0) {
      this.clearTurnTimeout(roomId);
      return;
    }

    const currentPlayerId =
      state.players[state.game.currentTurn % state.players.length]!.id;

    const roomResult = this.roomService.getRoomData(roomId);
    const nickname =
      roomResult.success && roomResult.message
        ? (roomResult.message
            .getAllPlayersData()
            .find((player) => player.userId === currentPlayerId)?.nickname ??
          "system")
        : "system";

    const actionResult = game.processAction({
      type: "TIMEOUT",
      nickname,
    });

    if (!actionResult.success) {
      this.startTurnTimeout(roomId);
      return;
    }

    const updatedState = game.getState();
    const lastMove = updatedState.game.history[updatedState.game.history.length - 1];
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
        winnerUserId = updatedState.players[updatedState.game.winner]!.id || null;
        result = "win";
      }

      this.publisher.emitGameOver(roomId, {
        result,
        winner: winnerUserId,
        winnerIndex: updatedState.game.winner,
        board: reconstructBoard(updatedState.game.history),
      });
      this.clearTurnTimeout(roomId);
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

    this.startTurnTimeout(roomId);
  }

  private startReadyTimeout(roomId: string) {
    if (this.readyTimeouts.has(roomId)) {
      const expiresAt = this.readyTimeoutExpiresAt.get(roomId);
      const remainingMs = expiresAt ? Math.max(0, expiresAt - Date.now()) : 0;
      this.publisher.emitReadyTimeoutStarted(roomId, remainingMs);
      return;
    }

    const expiresAt = Date.now() + this.readyTimeoutMs;
    const timeout = setTimeout(() => {
      void this.handleReadyTimeout(roomId);
    }, this.readyTimeoutMs);

    this.readyTimeouts.set(roomId, timeout);
    this.readyTimeoutExpiresAt.set(roomId, expiresAt);
    this.publisher.emitReadyTimeoutStarted(roomId, this.readyTimeoutMs);
  }

  private clearReadyTimeout(
    roomId: string,
    reason: "ROOM_NOT_FULL" | "ALL_READY" | "ROOM_UNAVAILABLE",
  ) {
    const timeout = this.readyTimeouts.get(roomId);
    if (!timeout) {
      return;
    }

    clearTimeout(timeout);
    this.readyTimeouts.delete(roomId);
    this.readyTimeoutExpiresAt.delete(roomId);
    this.publisher.emitReadyTimeoutCanceled(roomId, reason);
  }

  private async handleReadyTimeout(roomId: string): Promise<void> {
    this.readyTimeouts.delete(roomId);
    this.readyTimeoutExpiresAt.delete(roomId);

    const roomResult = this.roomService.getRoomData(roomId);
    if (!roomResult.success || !roomResult.message) {
      return;
    }

    if (!roomResult.message.isFull()) {
      return;
    }

    const players = roomResult.message.getAllPlayersData();
    const unreadyPlayers = players.filter((player) => !player.isReady);

    if (unreadyPlayers.length === 0) {
      return;
    }

    for (const player of unreadyPlayers) {
      const removeResult = this.roomService.removePlayer(roomId, player.userId);
      if (!removeResult.success) {
        continue;
      }

      await this.publisher.evictPlayerFromRoom(
        roomId,
        player.userId,
        "Ready timeout",
      );
    }

    const updatedRoomResult = this.roomService.getRoomData(roomId);
    if (!updatedRoomResult.success || !updatedRoomResult.message) {
      return;
    }

    const remainingPlayers = updatedRoomResult.message.getAllPlayersData();
    for (const player of remainingPlayers) {
      if (!player.isReady) {
        continue;
      }

      const resetResult = this.roomService.readyPlayer(
        roomId,
        player.userId,
        false,
      );
      if (!resetResult.success) {
        continue;
      }

      this.publisher.emitPlayerReady(roomId, {
        userId: player.userId,
        nickname: player.nickname,
        ...(player.avatar ? { avatar: player.avatar } : {}),
        isReady: false,
      });
    }

    this.publisher.emitReadyTimeoutExpired(
      roomId,
      "system",
      "Ready timeout: unready player removed",
    );
  }
}

export default GameFlowService;


