import { Namespace, Server, Socket } from "socket.io";
import Receiver from "../Receiver.js";
import type SocketManager from "../SocketManger.js";
import http from "http";
import LobbyIOManager from "./LobbyIOManager.js";
import RoomIOManager from "./RoomIOManager.js";
import type Service from "../../service/Service.js";
import type RedisManager from "../../utils/redis.js";
import type { ServerEvents, ClientEvents } from "@share";

class SocketIOManager implements SocketManager {
  io: Server<ClientEvents, ServerEvents>;
  receiver: Receiver;
  lobby: LobbyIOManager;
  room: RoomIOManager;
  service: Service;
  redis: RedisManager;

  constructor(
    server: http.Server,
    receiver: Receiver,
    service: Service,
    redis: RedisManager,
  ) {
    console.log("[SocketIOManager] Initializing Socket.IO server...");
    this.io = new Server<ClientEvents, ServerEvents>(server, {
      // Socket.IO 기본 경로 사용
      cors: {
        origin: ["http://localhost:3000", "http://localhost:80"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    console.log(
      "[SocketIOManager] Socket.IO server created with path: /socket.io (default)",
    );
    this.receiver = receiver;
    this.service = service;
    this.redis = redis;
    this.lobby = new LobbyIOManager(this.io.of("/lobby"), service);
    this.room = new RoomIOManager(this.io.of("/room"), receiver);
  }

  init() {
    console.log("[SocketIOManager] Initializing event listeners...");
    this.setupEventListeners();
    this.sendEvent();

    // Socket.IO 엔진 이벤트 로그
    this.io.engine.on("connection_error", (err) => {
      console.error("[SocketIOManager] Engine connection error:", err);
    });

    this.io.engine.on("initial_headers", (headers, req) => {
      console.log("[SocketIOManager] Initial headers from:", req.url);
    });

    console.log(
      "[SocketIOManager] Socket.IO is ready and listening for connections",
    );

    setInterval(() => {
      console.log(
        `[SocketIOManager] Active connections: ${this.io.engine.clientsCount}`,
      );
    }, 50000);
  }

  setupEventListeners() {
    console.log("[SocketIOManager] Setting up root namespace listener...");

    // 루트 네임스페이스 연결 처리 (클라이언트가 ws://localhost:8080/ws/ 로 연결)
    this.io.on("connection", async (socket: Socket) => {
      console.log("=".repeat(60));
      console.log(`[SocketIOManager] 🔌 NEW CONNECTION DETECTED!`);
      console.log(`[SocketIOManager] Socket ID: ${socket.id}`);
      console.log(`[SocketIOManager] Transport: ${socket.conn.transport.name}`);

      const ticket = socket.handshake.auth?.ticket;

      console.log("[SocketIOManager] Auth data:", { ticket });

      // 클라이언트에 연결 성공 알림
      socket.emit("CONNECTED", {
        success: true,
        socketId: socket.id,
        message: "Socket connection established",
      });

      if (!ticket) {
        console.error("[SocketIOManager] ❌ No ticket, disconnecting");
        socket.emit("ERROR", { message: "ticket is required" });
        socket.disconnect();
        return;
      }

      // 티켓 검증 (Redis)
      console.log(`[SocketIOManager] Validating ticket: ${ticket}`);
      const ticketData = await this.redis.get(ticket);

      if (!ticketData) {
        console.error(
          "[SocketIOManager] ❌ Invalid or expired ticket, disconnecting",
        );
        socket.emit("ERROR", { message: "Invalid or expired ticket" });
        socket.disconnect();
        return;
      }

      // 티켓 데이터 파싱
      let userId: string;
      let nickname: string;
      let avatar: string | undefined;

      try {
        const parsedData = JSON.parse(ticketData);
        userId = parsedData.userId;
        nickname = parsedData.nickname;
        avatar = parsedData.avatar;

        console.log("[SocketIOManager] ✅ Ticket validated:", {
          userId,
          nickname,
          avatar,
        });
      } catch (error) {
        console.error(
          "[SocketIOManager] ❌ Failed to parse ticket data:",
          error,
        );
        socket.emit("ERROR", { message: "Invalid ticket format" });
        socket.disconnect();
        return;
      }

      // 티켓 사용 완료 - 삭제 (one-time use)
      await this.redis.del(ticket);
      console.log(`[SocketIOManager] 🗑️ Ticket deleted: ${ticket}`);

      // 방 찾기 또는 생성
      console.log("[SocketIOManager] Finding or creating room...");
      const result = this.service.findOrCreateRoom();

      if (result.success && result.message) {
        const roomId = result.message;
        console.log(
          `[SocketIOManager] ✅ Room assigned: ${roomId} to user: ${userId}`,
        );

        // 방에 조인하기 전 기존 플레이어 정보 가져오기
        const roomData = this.service.getRoomData(roomId);
        const existingPlayers =
          roomData.success && roomData.message
            ? roomData.message.getAllPlayersData()
            : [];

        console.log(
          `[SocketIOManager] Existing players in room: ${existingPlayers.length}`,
        );

        // 새 플레이어를 방에 추가
        const joinResult = this.service.joinPlayer(
          roomId,
          userId,
          nickname,
          avatar,
        );

        if (!joinResult.success) {
          console.error(
            `[SocketIOManager] ❌ Failed to join player to room: ${joinResult.message}`,
          );
          socket.emit("ERROR", { message: "Failed to join room" });
          socket.disconnect();
          return;
        }

        // Socket.IO room에 조인
        socket.join(roomId);
        console.log(
          `[SocketIOManager] Socket ${socket.id} joined room ${roomId}`,
        );

        // Socket 데이터에 roomId와 userId 저장 (disconnect 시 사용)
        socket.data.roomId = roomId;
        socket.data.userId = userId;
        socket.data.nickname = nickname;
        socket.data.avatar = avatar;

        // 새 플레이어 정보
        const newPlayerInfo = {
          userId,
          nickname,
          isReady: false,
          avatar,
        };

        // 1. 기존 플레이어들에게 새 플레이어 입장 알림
        if (existingPlayers.length > 0) {
          socket.to(roomId).emit("PLAYER_JOINED", {
            player: {
              connId: userId,
              nickname,
              isReady: false,
              avatar,
            },
            roomId,
          });
          console.log(
            `[SocketIOManager] 📢 Notified ${existingPlayers.length} existing player(s) about new player`,
          );
        }

        // 2. 새 플레이어에게 기존 플레이어 정보 전송
        socket.emit("EXISTING_PLAYERS", {
          players: existingPlayers,
          roomId,
        });
        console.log(
          `[SocketIOManager] 📤 Sent ${existingPlayers.length} existing player(s) info to new player`,
        );

        // 3. 방 배정 완료 알림
        socket.emit("ROOM_ASSIGNED", { roomId });
        console.log(`[SocketIOManager] ✅ Room assignment complete`);
      } else {
        console.error("[SocketIOManager] ❌ Failed to assign room");
        socket.emit("ERROR", { message: "Failed to assign room" });
        socket.disconnect();
      }

      // LEAVE 이벤트 핸들러: 플레이어가 명시적으로 방을 나갈 때
      socket.on("LEAVE", () => {
        console.log(`[SocketIOManager] 🚪 LEAVE event from ${socket.id}`);

        const roomId = socket.data.roomId;
        const userId = socket.data.userId;
        const nickname = socket.data.nickname;
        const avatar = socket.data.avatar;

        if (roomId && userId) {
          console.log(
            `[SocketIOManager] Processing LEAVE: user=${userId} from room=${roomId}`,
          );

          // 방에서 플레이어 제거
          const removeResult = this.service.removePlayer(roomId, userId);

          if (removeResult.success) {
            console.log(
              `[SocketIOManager] ✅ Player left successfully: ${removeResult.message}`,
            );

            // 같은 방의 다른 플레이어들에게 LEAVE 알림
            socket.to(roomId).emit("PLAYER_LEFT", {
              connId: userId,
              nickname,
              avatar,
              roomId,
            });
            console.log(
              `[SocketIOManager] 📢 Notified other players: ${nickname} left`,
            );

            // 방에서 떠나기
            socket.leave(roomId);

            // socket data 정리
            delete socket.data.roomId;
            delete socket.data.userId;
            delete socket.data.nickname;
            delete socket.data.avatar;

            // 클라이언트에게 성공 응답
            socket.emit("LEAVE_SUCCESS", {
              success: true,
              message: "Successfully left the room",
            });
          } else {
            console.error(
              `[SocketIOManager] ❌ Failed to leave: ${removeResult.message}`,
            );
            socket.emit("ERROR", { message: "Failed to leave room" });
          }
        } else {
          console.error(
            "[SocketIOManager] ❌ LEAVE failed: no room/user data found",
          );
          socket.emit("ERROR", { message: "Not in a room" });
        }
      });

      // READY 이벤트 핸들러: 플레이어가 준비 상태를 변경할 때
      socket.on("READY", (data: { isReady: boolean }) => {
        console.log(
          `[SocketIOManager] ✅ READY event from ${socket.id}:`,
          data,
        );

        const roomId = socket.data.roomId;
        const userId = socket.data.userId;
        const nickname = socket.data.nickname;
        const avatar = socket.data.avatar;

        if (!roomId || !userId) {
          console.error(
            "[SocketIOManager] ❌ READY failed: no room/user data found",
          );
          socket.emit("ERROR", { message: "Not in a room" });
          return;
        }

        const isReady = data?.isReady ?? true; // 기본값: true

        console.log(
          `[SocketIOManager] Setting ready status: user=${userId}, ready=${isReady}`,
        );

        // 플레이어의 준비 상태 업데이트
        const readyResult = this.service.readyPlayer(roomId, userId, isReady);

        if (readyResult.success) {
          console.log(
            `[SocketIOManager] ✅ Ready status updated for ${nickname}`,
          );

          // 같은 방의 모든 플레이어들에게 (자신 포함) READY 상태 알림
          this.io.to(roomId).emit("PLAYER_READY", {
            connId: userId,
            nickname,
            avatar,
            isReady,
            roomId,
          });
          console.log(
            `[SocketIOManager] 📢 Notified all players: ${nickname} ready=${isReady}`,
          );

          // 방 전체 플레이어 레디 상태 확인
          const roomResult = this.service.getRoomData(roomId);
          if (!roomResult.success || !roomResult.message) {
            console.error(
              `[SocketIOManager] ❌ Failed to get room data: ${roomResult.message}`,
            );
            return;
          }

          const players = roomResult.message.getAllPlayersData();
          const allReady =
            players.length > 0 && players.every((player) => player.isReady);
          const roomIsFull = roomResult.message.isFull();

          console.log(
            `[SocketIOManager] Ready check - roomId=${roomId}, players=${players.length}, full=${roomIsFull}, allReady=${allReady}`,
          );

          // 전원 레디 + 방 정원 충족이면 게임 시작 이벤트 발신
          if (roomIsFull && allReady) {
            const startGameResult = this.service.gameStart(roomId);

            if (!startGameResult.success) {
              console.error(
                `[SocketIOManager] ❌ Failed to start game: ${startGameResult.message}`,
              );
              this.io.to(roomId).emit("ERROR", {
                message: "Failed to start game",
                roomId,
              });
              return;
            }

            // 게임 시작 직후 다음 판 준비를 위해 ready 상태를 초기화한다.
            for (const player of players) {
              const resetReadyResult = this.service.readyPlayer(
                roomId,
                player.connId,
                false,
              );

              if (!resetReadyResult.success) {
                console.error(
                  `[SocketIOManager] ❌ Failed to reset ready for ${player.connId}: ${resetReadyResult.message}`,
                );
                continue;
              }

              this.io.to(roomId).emit("PLAYER_READY", {
                connId: player.connId,
                nickname: player.nickname,
                ...(player.avatar ? { avatar: player.avatar } : {}),
                isReady: false,
                roomId,
              });
            }

            const gameStateResult = this.service.getGameState(roomId);
            if (!gameStateResult.success || !gameStateResult.message) {
              console.error(
                `[SocketIOManager] ❌ Failed to get game state after start: ${gameStateResult.message}`,
              );
              this.io.to(roomId).emit("ERROR", {
                message: "Failed to get game state",
                roomId,
              });
              return;
            }

            const state = gameStateResult.message.getState();
            this.io.to(roomId).emit("PLAYING", {
              roomId,
              status: state.status as "PLAYING",
              currentTurnPlayerId: state.players[state.currentTurn]!,
              players: state.players,
            });
            console.log(
              `[SocketIOManager] 🎮 Game started and PLAYING emitted to room ${roomId}`,
            );
          }
        } else {
          console.error(
            `[SocketIOManager] ❌ Failed to update ready status: ${readyResult.message}`,
          );
          socket.emit("ERROR", { message: "Failed to update ready status" });
        }
      });

      // MOVE 이벤트 핸들러: 플레이어가 수를 둘 때
      socket.on("MOVE", (data: { move: number }) => {
        console.log(`[SocketIOManager] 🎯 MOVE event from ${socket.id}:`, data);

        const roomId = socket.data.roomId;
        const userId = socket.data.userId;
        const nickname = socket.data.nickname;

        if (!roomId || !userId || !nickname) {
          console.error(
            "[SocketIOManager] ❌ MOVE failed: no room/user data found",
          );
          socket.emit("ERROR", { message: "Not in a room" });
          return;
        }

        if (typeof data?.move !== "number" || data.move < 0 || data.move > 8) {
          console.error(
            `[SocketIOManager] ❌ MOVE failed: invalid move index ${data?.move}`,
          );
          socket.emit("ERROR", { message: "Invalid move: must be 0-8" });
          return;
        }

        const move = data.move;
        console.log(
          `[SocketIOManager] Processing move: user=${userId}, room=${roomId}, position=${move}`,
        );

        // Action 객체 생성
        const action = {
          type: "MOVE",
          move,
          nickname,
        };

        // 게임 로직 처리 (유효성 검증 및 보드 업데이트)
        const moveResult = this.service.getGameState(roomId);
        if (!moveResult.success || !moveResult.message) {
          console.error(
            `[SocketIOManager] ❌ Failed to get game state: ${moveResult.message}`,
          );
          socket.emit("ERROR", { message: "Game not found" });
          return;
        }

        const game = moveResult.message;
        const actionResult = game.processAction(action);

        if (!actionResult.success) {
          console.error(
            `[SocketIOManager] ❌ Move rejected: ${actionResult.message}`,
          );
          socket.emit("ERROR", { message: actionResult.message });
          return;
        }

        // 업데이트된 게임 상태 조회
        const state = game.getState();
        console.log(
          `[SocketIOManager] Move processed, game status: ${state.status}`,
        );

        // 모든 플레이어에게 수를 둔 결과 브로드캐스트
        this.io.to(roomId).emit("MOVE_MADE", {
          connId: userId,
          move,
        });
        console.log(
          `[SocketIOManager] 📢 MOVE_MADE broadcasted to room ${roomId}`,
        );

        // 게임 종료 확인
        if (state.status === "GAME_OVER") {
          let winnerUserId: string | null = null;
          let result: "win" | "draw" = "draw";

          if (state.winner >= 0 && state.winner < state.players.length) {
            winnerUserId = state.players[state.winner] || null;
            result = "win";
          }

          this.io.to(roomId).emit("GAME_OVER", {
            roomId,
            result,
            winner: winnerUserId,
            winnerIndex: state.winner,
            board: state.board,
          });
          console.log(
            `[SocketIOManager] 🏁 GAME_OVER broadcasted: result=${result}, winner=${winnerUserId}`,
          );
        } else {
          // 게임 진행 중 - 다음 턴 플레이어 알림
          const nextPlayerId =
            state.players[state.currentTurn % state.players.length]!;
          this.io.to(roomId).emit("NEXT_TURN", {
            roomId,
            currentTurn: state.currentTurn,
            nextPlayerId,
          });
          console.log(
            `[SocketIOManager] 🔄 NEXT_TURN broadcasted: turn=${state.currentTurn}, player=${nextPlayerId}`,
          );
        }
      });

      socket.on("disconnect", (reason) => {
        console.log(
          `[SocketIOManager] 🔌 Disconnect: ${socket.id}, reason: ${reason}`,
        );

        const roomId = socket.data.roomId;
        const userId = socket.data.userId;
        const nickname = socket.data.nickname;
        const avatar = socket.data.avatar;

        if (roomId && userId) {
          console.log(
            `[SocketIOManager] Removing player ${userId} from room ${roomId}`,
          );

          // 방에서 플레이어 제거
          const removeResult = this.service.removePlayer(roomId, userId);

          if (removeResult.success) {
            console.log(
              `[SocketIOManager] ✅ Player removed: ${removeResult.message}`,
            );

            // 같은 방의 다른 플레이어들에게 나간 플레이어 정보 전송
            socket.to(roomId).emit("PLAYER_LEFT", {
              connId: userId,
              nickname,
              avatar,
              roomId,
            });
            console.log(
              `[SocketIOManager] 📢 Notified other players about ${nickname} leaving`,
            );
          } else {
            console.error(
              `[SocketIOManager] ❌ Failed to remove player: ${removeResult.message}`,
            );
          }
        } else {
          console.log(
            "[SocketIOManager] No room/user data found for disconnecting socket",
          );
        }
      });
      console.log("=".repeat(60));
    });

    console.log("[SocketIOManager] Root namespace listener registered");
    this.room.setupEventListeners();
    this.lobby.setupEventListeners();
    console.log("[SocketIOManager] All namespace listeners registered");
  }

  sendEvent() {
    this.lobby.sendEvent();
    this.room.sendEvent();
  }
}

export default SocketIOManager;
