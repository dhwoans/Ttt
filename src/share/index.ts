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

export * from "./rest-api.types";

type RestSchemas = import("./rest-api.types").components["schemas"];
type ClientSchemas =
  import("./socket-client-events.types.js").components["schemas"];
type ServerSchemas =
  import("./socket-server-events.types.js").components["schemas"];

export type IssueTicketRequest = RestSchemas["IssueTicketRequest"];
export type IssueTicketResponse = RestSchemas["IssueTicketResponse"];

export type ReadyEventPayload = ClientSchemas["ReadyEventPayload"];
export type MoveEventPayload = ClientSchemas["MoveEventPayload"];
export type LeaveEventPayload = Record<string, never>;

export type PlayingEvent = ServerSchemas["PlayingEvent"];
export type ExistingPlayersEvent = ServerSchemas["ExistingPlayersEvent"];
export type PlayerJoinedEvent = ServerSchemas["PlayerJoinedEvent"];
export type PlayerReadyEvent = ServerSchemas["PlayerReadyEvent"];
export type ReadyTimeoutExpiredEvent =
  ServerSchemas["ReadyTimeoutExpiredEvent"];
export type TurnTimeoutStartedEvent = ServerSchemas["TurnTimeoutStartedEvent"];
export type MoveMadeEvent = ServerSchemas["MoveMadeEvent"];
export type GameOverEvent = ServerSchemas["GameOverEvent"];
export type PlayerLeftEvent = ServerSchemas["PlayerLeftEvent"];
export type LeaveSuccessEvent = ServerSchemas["LeaveSuccessEvent"];

export interface ClientEvents {
  READY: (payload: ReadyEventPayload) => void;
  MOVE: (payload: MoveEventPayload) => void;
  LEAVE: (payload: LeaveEventPayload) => void;
  CHAT: (payload: unknown) => void;
  [eventName: string]: (payload: unknown) => void;
}

export interface ServerEvents {
  EXISTING_PLAYERS: (payload: ExistingPlayersEvent) => void;
  PLAYER_JOINED: (payload: PlayerJoinedEvent) => void;
  PLAYER_READY: (payload: PlayerReadyEvent) => void;
  READY_TIMEOUT_EXPIRED: (payload: ReadyTimeoutExpiredEvent) => void;
  TURN_TIMEOUT_STARTED: (payload: TurnTimeoutStartedEvent) => void;
  MOVE_MADE: (payload: MoveMadeEvent) => void;
  GAME_OVER: (payload: GameOverEvent) => void;
  PLAYER_LEFT: (payload: PlayerLeftEvent) => void;
  LEAVE_SUCCESS: (payload: LeaveSuccessEvent) => void;
  [eventName: string]: (payload: unknown) => void;
}
