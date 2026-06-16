import type { Socket } from "socket.io";
import type RoomService from "./RoomService.js";
import type SocketErrorResponder from "../routes/socketio/SocketErrorResponder.js";
import type GameEventPublisher from "../routes/socketio/GameEventPublisher.js";
import { reconstructBoard, type PlayerData } from "@ttt/core";
import { ReadyTimeoutManager } from "./ReadyTimeoutManager.js";
import { TurnTimeoutManager } from "./TurnTimeoutManager.js";

/**
 * 게임 진행 흐름(READY, MOVE, 상태 전이)을 오케스트레이션하는 서비스.
 *
 * 도메인 처리 결과를 받아 적절한 송신 이벤트를 발행하며,
 * Socket 핸들러가 비즈니스 규칙을 직접 가지지 않도록 분리한다.
 */
class GameFlowService {
  private readonly readyTimeoutManager: ReadyTimeoutManager;
  private readonly turnTimeoutManager: TurnTimeoutManager;

  constructor(
    private readonly roomService: RoomService,
    private readonly errors: SocketErrorResponder,
    private readonly publisher: GameEventPublisher,
  ) {
    this.readyTimeoutManager = new ReadyTimeoutManager(roomService, publisher);
    this.turnTimeoutManager = new TurnTimeoutManager(roomService, publisher);
  }

  onRoomStateChanged(roomId: string) {
    const roomResult = this.roomService.getRoomData(roomId);
    if (!roomResult.success || !roomResult.message) {
      this.readyTimeoutManager.clear(roomId, "ROOM_UNAVAILABLE");
      this.turnTimeoutManager.clear(roomId);
      return;
    }

    const players = roomResult.message.tree.players;
    const roomIsFull = roomResult.message.tree.players.length >= 2;
    const allReady =
      players.length > 0 && players.every((player) => player.isReady);


    if (!roomIsFull) {
      this.readyTimeoutManager.clear(roomId, "ROOM_NOT_FULL");
      this.turnTimeoutManager.clear(roomId);
      return;
    }

    if (allReady) {
      this.readyTimeoutManager.clear(roomId, "ALL_READY");
      return;
    }

    this.readyTimeoutManager.start(roomId);
  }

  syncReadyTimeoutForSocket(socket: Socket, roomId: string) {
    const remainingMs = this.readyTimeoutManager.getRemainingMs(roomId);
    if (remainingMs <= 0) {
      return;
    }

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

    const players = roomResult.message.tree.players;
    const allReady =
      players.length > 0 && players.every((player) => player.isReady);

    const roomIsFull = roomResult.message.tree.players.length >= 2;

    if (!roomIsFull || !allReady) {
      this.onRoomStateChanged(roomId);
      return;
    }

    this.readyTimeoutManager.clear(roomId, "ALL_READY");

    const startGameResult = this.roomService.gameStart(roomId);
    if (!startGameResult.success) {
      this.publisher.emitRoomError(roomId, "Failed to start game");
      return;
    }

    for (const player of players) {
      const resetReadyResult = this.roomService.readyPlayer(
        roomId,
        player.id,
        false,
      );
      if (!resetReadyResult.success) {
        continue;
      }

      this.publisher.emitPlayerReady(roomId, {
        userId: player.id,
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

    this.turnTimeoutManager.start(roomId);
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
      userId,
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

    this.turnTimeoutManager.clear(roomId);
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
      this.turnTimeoutManager.clear(roomId);
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

    this.turnTimeoutManager.start(roomId);
  }
}

export default GameFlowService;
