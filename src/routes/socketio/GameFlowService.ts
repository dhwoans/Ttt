import type { Socket } from "socket.io";
import type Service from "../../service/Service.js";
import SocketErrorResponder from "./SocketErrorResponder.js";
import GameEventPublisher from "./GameEventPublisher.js";

/**
 * 게임 진행 흐름(READY, MOVE, 상태 전이)을 오케스트레이션하는 서비스.
 *
 * 도메인 처리 결과를 받아 적절한 송신 이벤트를 발행하며,
 * Socket 핸들러가 비즈니스 규칙을 직접 가지지 않도록 분리한다.
 */
class GameFlowService {
  constructor(
    private readonly service: Service,
    private readonly errors: SocketErrorResponder,
    private readonly publisher: GameEventPublisher,
  ) {}

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
    const readyResult = this.service.readyPlayer(roomId, userId, isReady);

    if (!readyResult.success) {
      this.errors.emit(socket, "Failed to update ready status");
      return;
    }

    this.publisher.emitPlayerReady(roomId, {
      connId: userId,
      nickname,
      ...(avatar ? { avatar } : {}),
      isReady,
    });

    const roomResult = this.service.getRoomData(roomId);
    if (!roomResult.success || !roomResult.message) {
      return;
    }

    const players = roomResult.message.getAllPlayersData();
    const allReady =
      players.length > 0 && players.every((player) => player.isReady);
    const roomIsFull = roomResult.message.isFull();

    if (!roomIsFull || !allReady) {
      return;
    }

    const startGameResult = this.service.gameStart(roomId);
    if (!startGameResult.success) {
      this.publisher.emitRoomError(roomId, "Failed to start game");
      return;
    }

    for (const player of players) {
      const resetReadyResult = this.service.readyPlayer(
        roomId,
        player.connId,
        false,
      );
      if (!resetReadyResult.success) {
        continue;
      }

      this.publisher.emitPlayerReady(roomId, {
        connId: player.connId,
        nickname: player.nickname,
        ...(player.avatar ? { avatar: player.avatar } : {}),
        isReady: false,
      });
    }

    const gameStateResult = this.service.getGameState(roomId);
    if (!gameStateResult.success || !gameStateResult.message) {
      this.publisher.emitRoomError(roomId, "Failed to get game state");
      return;
    }

    const state = gameStateResult.message.getState();
    this.publisher.emitPlaying(roomId, {
      status: state.status as "PLAYING",
      currentTurnPlayerId: state.players[state.currentTurn]!,
      players: state.players,
    });
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
      type: "MOVE",
      move,
      nickname,
    };

    const moveResult = this.service.getGameState(roomId);
    if (!moveResult.success || !moveResult.message) {
      this.errors.emit(socket, "Game not found");
      return;
    }

    const game = moveResult.message;
    const actionResult = game.processAction(action);

    if (!actionResult.success) {
      this.errors.emit(socket, actionResult.message);
      return;
    }

    const state = game.getState();
    this.publisher.emitMoveMade(roomId, {
      connId: userId,
      move,
    });

    if (state.status === "GAME_OVER") {
      let winnerUserId: string | null = null;
      let result: "win" | "draw" = "draw";

      if (state.winner >= 0 && state.winner < state.players.length) {
        winnerUserId = state.players[state.winner] || null;
        result = "win";
      }

      this.publisher.emitGameOver(roomId, {
        result,
        winner: winnerUserId,
        winnerIndex: state.winner,
        board: state.board,
      });
      return;
    }

    const nextPlayerId =
      state.players[state.currentTurn % state.players.length]!;
    this.publisher.emitNextTurn(roomId, {
      currentTurn: state.currentTurn,
      nextPlayerId,
    });
  }
}

export default GameFlowService;
