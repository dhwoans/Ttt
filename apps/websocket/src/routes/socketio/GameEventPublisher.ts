import type { Server, Socket } from "socket.io";
import type { ClientEvents, ServerEvents } from "@ttt/contract";

type PlayerPayload = {
  userId: string;
  nickname: string;
  isReady: boolean;
  avatar?: string;
};

/**
 * Socket 이벤트 송신 전담 클래스.
 *
 * payload 포맷을 한 곳에서 관리하여
 * 전송 규격을 일관되게 유지한다.
 */
class GameEventPublisher {
  constructor(private readonly io: Server<ClientEvents, ServerEvents>) {}

  /** 연결 직후 클라이언트에 연결 성공 이벤트를 전달한다. */
  emitConnected(socket: Socket) {
    socket.emit("CONNECTED", {
      success: true,
      socketId: socket.id,
      message: "Socket connection established",
    });
  }

  emitRoomAssigned(socket: Socket, roomId: string) {
    socket.emit("ROOM_ASSIGNED", { roomId });
  }

  /** 새로 입장한 플레이어에게 현재 방의 기존 플레이어 목록을 전달한다. */
  emitExistingPlayers(
    socket: Socket,
    roomId: string,
    players: PlayerPayload[],
  ) {
    socket.emit("EXISTING_PLAYERS", { players, roomId });
  }

  emitPlayerJoined(socket: Socket, roomId: string, player: PlayerPayload) {
    socket.to(roomId).emit("PLAYER_JOINED", {
      player,
      roomId,
    });
  }

  emitPlayerLeft(
    socket: Socket,
    roomId: string,
    payload: {
      userId: string;
      nickname?: string;
      avatar?: string;
    },
  ) {
    socket.to(roomId).emit("PLAYER_LEFT", {
      ...payload,
      roomId,
    });
  }

  emitLeaveSuccess(socket: Socket) {
    socket.emit("LEAVE_SUCCESS", {
      success: true,
      message: "Successfully left the room",
    });
  }

  /** 방 전체에 플레이어 READY 상태 변화를 브로드캐스트한다. */
  emitPlayerReady(
    roomId: string,
    payload: {
      userId: string;
      nickname: string;
      avatar?: string;
      isReady: boolean;
    },
  ) {
    this.io.to(roomId).emit("PLAYER_READY", {
      ...payload,
      roomId,
    });
  }

  /** 게임 시작 후 PLAYING 상태 정보를 방 전체에 전송한다. */
  emitPlaying(
    roomId: string,
    payload: {
      status: "PLAYING";
      currentTurnPlayerId: string;
      players: string[];
    },
  ) {
    this.io.to(roomId).emit("PLAYING", {
      roomId,
      ...payload,
    });
  }

  /** 유효한 MOVE 적용 결과를 방 전체에 전파한다. */
  emitMoveMade(
    roomId: string,
    payload: { userId: string; move: number; isAuto?: boolean },
  ) {
    this.io.to(roomId).emit("MOVE_MADE", payload);
  }

  emitTurnTimeoutStarted(
    roomId: string,
    payload: { timeoutMs: number; currentTurnPlayerId: string },
  ) {
    this.io.to(roomId).emit("TURN_TIMEOUT_STARTED", {
      roomId,
      ...payload,
    });
  }

  /** 다음 턴 플레이어 정보를 방 전체에 전송한다. */
  emitNextTurn(
    roomId: string,
    payload: { currentTurn: number; nextPlayerId: string },
  ) {
    this.io.to(roomId).emit("NEXT_TURN", {
      roomId,
      ...payload,
    });
  }

  /** 게임 종료 결과를 방 전체에 전송한다. */
  emitGameOver(
    roomId: string,
    payload: {
      result: "win" | "draw";
      winner: string | null;
      winnerIndex: number;
      board: string[];
    },
  ) {
    this.io.to(roomId).emit("GAME_OVER", {
      roomId,
      ...payload,
    });
  }

  /** 방 범위 에러를 공통 포맷으로 전송한다. */
  emitRoomError(roomId: string, message: string) {
    this.io.to(roomId).emit("ERROR", { message, roomId });
  }

  emitReadyTimeoutStarted(roomId: string, timeoutMs: number) {
    this.io.to(roomId).emit("READY_TIMEOUT_STARTED", {
      roomId,
      timeoutMs,
    });
  }

  emitReadyTimeoutStartedToSocket(
    socket: Socket,
    roomId: string,
    timeoutMs: number,
  ) {
    socket.emit("READY_TIMEOUT_STARTED", {
      roomId,
      timeoutMs,
    });
  }

  emitReadyTimeoutExpired(roomId: string, userId: string, message: string) {
    this.io.to(roomId).emit("READY_TIMEOUT_EXPIRED", {
      roomId,
      userId,
      message,
    });
  }

  emitReadyTimeoutCanceled(
    roomId: string,
    reason: "ROOM_NOT_FULL" | "ALL_READY" | "ROOM_UNAVAILABLE",
  ) {
    this.io.to(roomId).emit("READY_TIMEOUT_CANCELED", {
      roomId,
      reason,
    });
  }

  async evictPlayerFromRoom(
    roomId: string,
    userId: string,
    reason: string,
  ): Promise<void> {
    const sockets = await this.io.in(roomId).fetchSockets();

    for (const socket of sockets) {
      const socketUserId = socket.data.userId as string | undefined;
      if (socketUserId !== userId) {
        continue;
      }

      const nickname = socket.data.nickname as string | undefined;
      const avatar = socket.data.avatar as string | undefined;

      socket.leave(roomId);
      delete socket.data.roomId;
      delete socket.data.userId;
      delete socket.data.nickname;
      delete socket.data.avatar;

      socket.emit("READY_TIMEOUT_EXPIRED", {
        roomId,
        userId,
        message: reason,
      });

      this.emitReadyTimeoutExpired(roomId, userId, reason);

      this.io.to(roomId).emit("PLAYER_LEFT", {
        userId,
        nickname: nickname ?? "unknown",
        ...(avatar ? { avatar } : {}),
        roomId,
      });

      return;
    }
  }
}

export type { PlayerPayload };
export default GameEventPublisher;
