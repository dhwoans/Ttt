/**
 * Shared Type Definitions for Frontend/Backend Contract
 *
 * 프론트엔드와 백엔드 간의 계약서입니다.
 * 모든 API 요청/응답, WebSocket 이벤트의 타입이 정의되어 있습니다.
 *
 * @example 프론트엔드 사용 예시
 * ```typescript
 * import {
 *   ClientEvents,
 *   ServerEvents,
 *   IssueTicketRequest,
 *   IssueTicketResponse
 * } from '@/share';
 *
 * // REST API
 * const ticketReq: IssueTicketRequest = {
 *   userId: 'user123',
 *   nickname: 'john',
 *   avatar: 'cat'
 * };
 * const ticketRes = await fetch('/api/ticket', {
 *   method: 'POST',
 *   body: JSON.stringify(ticketReq)
 * }).then(r => r.json() as IssueTicketResponse);
 *
 * // Socket.IO
 * import { io } from 'socket.io-client';
 *
 * const socket = io(ticketRes.gameServerUrl, {
 *   auth: { ticket: ticketRes.ticket }
 * });
 *
 * // 서버 이벤트 수신
 * socket.on('PLAYING', (data) => {
 *   console.log('Game started, first player:', data.currentTurnPlayerId);
 * });
 *
 * // 클라이언트 이벤트 전송
 * socket.emit('READY', { isReady: true });
 * socket.emit('MOVE', { move: 4 });
 * ```
 */

export * from "./rest-api.types.js";

type RestSchemas = import("./rest-api.types.js").components["schemas"];
export type IssueTicketRequest = RestSchemas["IssueTicketRequest"];
export type IssueTicketResponse = RestSchemas["IssueTicketResponse"];

type ClientSchemas =
  import("./socket-client-events.types.js").components["schemas"];
type ServerSchemas =
  import("./socket-server-events.types.js").components["schemas"];

export type ReadyEventPayload = ClientSchemas["ReadyEventPayload"];
export type MoveEventPayload = ClientSchemas["MoveEventPayload"];
export type LeaveEventPayload = Record<string, never>;

export type ExistingPlayersEvent = ServerSchemas["ExistingPlayersEvent"];
export type PlayerJoinedEvent = ServerSchemas["PlayerJoinedEvent"];
export type PlayerReadyEvent = ServerSchemas["PlayerReadyEvent"];
export type ReadyTimeoutExpiredEvent =
  ServerSchemas["ReadyTimeoutExpiredEvent"];
export type TurnTimeoutStartedEvent = ServerSchemas["TurnTimeoutStartedEvent"];
export type MoveMadeEvent = ServerSchemas["MoveMadeEvent"];
export type PlayerLeftEvent = ServerSchemas["PlayerLeftEvent"];
export type LeaveSuccessEvent = ServerSchemas["LeaveSuccessEvent"];

/** 클라이언트 → 서버 이벤트 맵 (Socket.IO ListenEvents) */
export type ClientEvents = {
  READY: (payload: ReadyEventPayload) => void;
  MOVE: (payload: MoveEventPayload) => void;
  LEAVE: (payload: LeaveEventPayload) => void;
};

/** 서버 → 클라이언트 이벤트 맵 (Socket.IO EmitEvents) */
export type ServerEvents = {
  CONNECTED: (payload: ServerSchemas["ConnectedEvent"]) => void;
  ROOM_ASSIGNED: (payload: ServerSchemas["RoomAssignedEvent"]) => void;
  EXISTING_PLAYERS: (payload: ServerSchemas["ExistingPlayersEvent"]) => void;
  PLAYER_JOINED: (payload: ServerSchemas["PlayerJoinedEvent"]) => void;
  PLAYER_READY: (payload: ServerSchemas["PlayerReadyEvent"]) => void;
  READY_TIMEOUT_STARTED: (
    payload: ServerSchemas["ReadyTimeoutStartedEvent"],
  ) => void;
  READY_TIMEOUT_EXPIRED: (
    payload: ServerSchemas["ReadyTimeoutExpiredEvent"],
  ) => void;
  READY_TIMEOUT_CANCELED: (
    payload: ServerSchemas["ReadyTimeoutCanceledEvent"],
  ) => void;
  PLAYING: (payload: ServerSchemas["PlayingEvent"]) => void;
  TURN_TIMEOUT_STARTED: (
    payload: ServerSchemas["TurnTimeoutStartedEvent"],
  ) => void;
  MOVE_MADE: (payload: ServerSchemas["MoveMadeEvent"]) => void;
  NEXT_TURN: (payload: ServerSchemas["NextTurnEvent"]) => void;
  GAME_OVER: (payload: ServerSchemas["GameOverEvent"]) => void;
  PLAYER_LEFT: (payload: ServerSchemas["PlayerLeftEvent"]) => void;
  LEAVE_SUCCESS: (payload: ServerSchemas["LeaveSuccessEvent"]) => void;
  ERROR: (payload: ServerSchemas["SocketErrorEvent"]) => void;
};
