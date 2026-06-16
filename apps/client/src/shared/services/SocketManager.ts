import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { ServerEvents, ClientEvents } from "@ttt/contract";
import { toast } from "react-toastify";

import { GAME_EVENTS } from "@/shared/constants/eventList";
import { useRoomStore } from "@/stores/useRoomStore";
import { useGameStore } from "@/stores/useGameStore";
import { mapPlayerData } from "@/shared/utils/playerUtils";

class GameSocketManager {
  private socket: Socket<ServerEvents, ClientEvents> | null = null;
  private currentTicket: string | null = null;

  public connect(
    userId: string,
    nickname: string,
    serverUrl: string = "/room",
    options: { roomId?: string; ticket?: string } = {},
  ) {
    const { roomId, ticket } = options;

    console.log("[socket.connect] 호출 시작:", {
      userId,
      nickname,
      serverUrl,
      ticket,
    });

    // ticket이 다르면 기존 연결을 끊고 새로 연결
    if (this.socket && this.socket.connected) {
      if (ticket && this.currentTicket === ticket) {
        console.log("[socket.connect] 동일한 ticket으로 이미 연결됨, 재사용");
        return;
      } else {
        console.log(
          "[socket.connect] 다른 ticket 또는 새 연결 필요, 기존 소켓 정리",
        );
        this.socket.disconnect();
        this.socket = null;
      }
    }

    // 이미 소켓 인스턴스가 있다면 정리
    if (this.socket) {
      console.log("[socket.connect] 기존 socket 정리");
      this.socket.disconnect();
    }

    // 현재 ticket 저장
    this.currentTicket = ticket || null;

    // URL 프로토콜 보정 (http/https -> ws/wss)
    let finalUrl = serverUrl;
    if (finalUrl.startsWith("http")) {
      finalUrl = finalUrl.replace(/^http/, "ws");
    }

    console.log("[socket] connect request", {
      finalUrl,
      path: "/socket.io",
      auth: {
        roomId,
        userId,
        ticket,
      },
    });

    this.socket = io(finalUrl, {
      path: "/socket.io",
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket"], // WebSocket 우선 사용
      auth: {
        roomId: roomId,
        userId: userId,
        ticket: ticket,
      },
    }) as unknown as Socket<ServerEvents, ClientEvents>;

    this.socket.on("connect", () => {
      console.log("[socket] 연결 성공, socket.id:", this.socket?.id);
      if (this.socket?.id) {
        useRoomStore.getState().setSocketId(this.socket.id);
      }
      if (roomId) {
        this.socket?.emit("JOIN" as any, {
          type: "JOIN",
          message: [roomId, userId],
          sender: nickname,
        });
      }
    });

    this.socket.on("disconnect", () => {
      console.log("[socket] 연결 종료");
    });

    this.socket.on("connect_error", (error: any) => {
      console.error("[socket] connect_error:", error?.message || error);
    });

    // 메시지 핸들러 등록
    GAME_EVENTS.forEach(({ name, log }) => {
      this.socket?.on(name as any, (data: any) => {
        if (log) {
          console.log(`[socket] ${name} 수신:`, JSON.stringify(data));
        }

        // --- Store 업데이트 직접 처리 (핵심 로직 통합) ---
        this.handleStoreUpdate(name, data);

        // --- 범용 이벤트 추적 (상태 기반 사이드 이펙트 트리거용) ---
        useRoomStore.getState().setLastServerEvent(name, data);
      });
    });
  }

  private handleStoreUpdate(name: string, data: any) {
    const gameStore = useGameStore.getState();
    const roomStore = useRoomStore.getState();

    switch (name) {
      case "ROOM_ASSIGNED": {
        const assignedRoomId = data.roomId;
        gameStore.setTree({
          game: { ...gameStore.tree.game, roomId: assignedRoomId },
        });
        break;
      }

      case "READY_TIMEOUT_STARTED": {
        const timeoutMs = Number(data?.timeoutMs);
        if (Number.isFinite(timeoutMs) && timeoutMs > 0) {
          roomStore.setReadyTimeoutSnapshot({
            timeoutMs,
            startedAt: Date.now(),
          });
        }
        break;
      }

      case "TURN_TIMEOUT_STARTED": {
        const timeoutMs = Number(data?.timeoutMs);
        if (Number.isFinite(timeoutMs) && timeoutMs > 0) {
          gameStore.setServerTurnTimer({ timeoutMs, startedAt: Date.now() });

          if (data.currentTurnPlayerId) {
            const index = gameStore.tree.players.findIndex(
              (p) => p.id === data.currentTurnPlayerId,
            );
            if (index !== -1) {
              gameStore.setTree({
                game: { ...gameStore.tree.game, currentTurn: index },
              });
            }
          }
        }
        break;
      }

      case "READY_TIMEOUT_CANCELED":
      case "READY_TIMEOUT_EXPIRED": {
        roomStore.setReadyTimeoutSnapshot(null);
        break;
      }

      case "PLAYING": {
        roomStore.setReadyTimeoutSnapshot(null);
        const players = data.players.map((id: string) => ({ id }));
        const currentTurn = data.players.indexOf(data.currentTurnPlayerId);
        gameStore.setTree({
          players,
          game: {
            ...gameStore.tree.game,
            status: "PLAYING",
            currentTurn: currentTurn !== -1 ? currentTurn : 0,
          },
        });
        break;
      }

      case "MOVE_MADE": {
        gameStore.setServerTurnTimer(null);
        roomStore.setIsWaitingForServer(false);
        const { userId, move } = data;
        const player = roomStore.playersInfos.find((p) => p.userId === userId);
        if (player) {
          gameStore.dispatch({
            type: "MOVE",
            move: move,
            symbol: player.avatar,
            nickname: player.nickname,
          });
        }
        break;
      }

      case "NEXT_TURN": {
        const index = gameStore.tree.players.findIndex(
          (p) => p.id === data.nextPlayerId,
        );
        if (index !== -1) {
          gameStore.setTree({
            game: { ...gameStore.tree.game, currentTurn: index },
          });
        }
        break;
      }

      case "GAME_OVER": {
        gameStore.setServerTurnTimer(null);
        let winnerIdx = -1;
        if (data.result === "draw") {
          winnerIdx = -2;
        } else if (data.winnerIndex !== undefined) {
          winnerIdx = data.winnerIndex;
        } else if (data.winner) {
          winnerIdx = roomStore.playersInfos.findIndex(
            (p) => p.userId === data.winner,
          );
        }
        gameStore.setTree({
          game: {
            ...gameStore.tree.game,
            status: "GAME_OVER",
            winner: winnerIdx,
          },
        });
        break;
      }

      case "PLAYER_READY": {
        roomStore.updatePlayerReadyStatus(data.userId, data.isReady);
        break;
      }

      case "EXISTING_PLAYERS": {
        const nextPlayers = data.players.map(mapPlayerData);
        roomStore.setPlayersInfos(nextPlayers);
        break;
      }

      case "PLAYER_JOINED": {
        const player = mapPlayerData(data.player);
        roomStore.addPlayerInfo(player);
        toast.info(`${player.nickname}님이 들어왔습니다!`);
        break;
      }

      case "PLAYER_LEFT": {
        roomStore.removePlayerInfo(data.nickname);
        toast.warning(`${data.nickname}님이 게임을 나갔습니다.`);
        break;
      }

      case "LEAVE_SUCCESS": {
        gameStore.setServerTurnTimer(null);
        break;
      }

      case "ERROR": {
        toast.error(
          typeof data.message === "string"
            ? data.message
            : "오류가 발생했습니다.",
        );
        break;
      }
    }
  }

  public sendMessage<E extends keyof ClientEvents>(
    event: E,
    payload: Parameters<ClientEvents[E]>[0],
  ): void;
  public sendMessage(event: string, payload: unknown): void;
  public sendMessage(event: string, payload: unknown) {
    console.log(
      `[socket.sendMessage] 호출: event=${event}, socket=${this.socket ? "존재" : "없음"}`,
    );

    if (!this.socket) {
      console.error(
        `[socket.sendMessage] socket이 없어서 메시지 전송 불가: ${event}`,
      );
      return;
    }

    console.log(`[socket.sendMessage] socket 상태:`, {
      connected: this.socket.connected,
      id: this.socket.id,
    });

    console.log(`[socket] ${event} 신호 서버로 보냄:`, payload);
    this.socket.emit(event as any, payload);

    if (event === "LEAVE") {
      this.disconnect();
    }
  }

  public disconnect() {
    if (this.socket) {
      console.log("[socket.disconnect] 소켓 연결 종료");
      this.socket.disconnect();
      this.socket = null;
      this.currentTicket = null;
      useRoomStore.getState().setSocketId(null);
    }
  }

  public getSocket() {
    return this.socket;
  }
}

export const gameSocketManager = new GameSocketManager();
