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
export * from "./socket-client-events.types.js";
export * from "./socket-server-events.types.js";
