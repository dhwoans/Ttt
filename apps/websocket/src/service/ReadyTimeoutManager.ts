import type RoomService from "./RoomService.js";
import type GameEventPublisher from "../routes/socketio/GameEventPublisher.js";

export class ReadyTimeoutManager {
  private readonly timeoutMs = 20000;
  private readonly timeouts = new Map<string, NodeJS.Timeout>();
  private readonly expiresAt = new Map<string, number>();

  constructor(
    private readonly roomService: RoomService,
    private readonly publisher: GameEventPublisher,
  ) {}

  start(roomId: string) {
    if (this.timeouts.has(roomId)) {
      const remainingMs = this.getRemainingMs(roomId);
      this.publisher.emitReadyTimeoutStarted(roomId, remainingMs);
      return;
    }

    const expiresAt = Date.now() + this.timeoutMs;
    const timeout = setTimeout(() => {
      void this.handleTimeout(roomId);
    }, this.timeoutMs);

    this.timeouts.set(roomId, timeout);
    this.expiresAt.set(roomId, expiresAt);
    this.publisher.emitReadyTimeoutStarted(roomId, this.timeoutMs);
  }

  clear(
    roomId: string,
    reason: "ROOM_NOT_FULL" | "ALL_READY" | "ROOM_UNAVAILABLE",
  ) {
    const timeout = this.timeouts.get(roomId);
    if (!timeout) {
      return;
    }

    clearTimeout(timeout);
    this.timeouts.delete(roomId);
    this.expiresAt.delete(roomId);
    this.publisher.emitReadyTimeoutCanceled(roomId, reason);
  }

  getRemainingMs(roomId: string): number {
    const expire = this.expiresAt.get(roomId);
    return expire ? Math.max(0, expire - Date.now()) : 0;
  }

  private async handleTimeout(roomId: string): Promise<void> {
    this.timeouts.delete(roomId);
    this.expiresAt.delete(roomId);

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
