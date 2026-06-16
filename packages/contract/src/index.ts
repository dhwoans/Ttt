import * as RestApi from "./generated/rest-api.types.js";
import * as SocketClient from "./generated/socket-client-events.types.js";
import * as SocketServer from "./generated/socket-server-events.types.js";

export { RestApi, SocketClient, SocketServer };

export * from "./generated/rest-api.types.js";

type RestSchemas = RestApi.components["schemas"];
type ClientSchemas = SocketClient.components["schemas"];
type ServerSchemas = SocketServer.components["schemas"];

export type IssueTicketRequest = RestSchemas["IssueTicketRequest"];
export type IssueTicketResponse = RestSchemas["IssueTicketResponse"];

export type ReadyEventPayload = ClientSchemas["ReadyEventPayload"];
export type MoveEventPayload = ClientSchemas["MoveEventPayload"];
export type LeaveEventPayload = Record<string, never>;

export type PlayingEvent = ServerSchemas["PlayingEvent"];
export type ConnectedEvent = ServerSchemas["ConnectedEvent"];
export type RoomAssignedEvent = ServerSchemas["RoomAssignedEvent"];
export type ExistingPlayersEvent = ServerSchemas["ExistingPlayersEvent"];
export type PlayerJoinedEvent = ServerSchemas["PlayerJoinedEvent"];
export type PlayerReadyEvent = ServerSchemas["PlayerReadyEvent"];
export type ReadyTimeoutStartedEvent =
  ServerSchemas["ReadyTimeoutStartedEvent"];
export type ReadyTimeoutExpiredEvent =
  ServerSchemas["ReadyTimeoutExpiredEvent"];
export type ReadyTimeoutCanceledEvent =
  ServerSchemas["ReadyTimeoutCanceledEvent"];
export type TurnTimeoutStartedEvent = ServerSchemas["TurnTimeoutStartedEvent"];
export type MoveMadeEvent = ServerSchemas["MoveMadeEvent"];
export type NextTurnEvent = ServerSchemas["NextTurnEvent"];
export type GameOverEvent = ServerSchemas["GameOverEvent"];
export type PlayerLeftEvent = ServerSchemas["PlayerLeftEvent"];
export type LeaveSuccessEvent = ServerSchemas["LeaveSuccessEvent"];
export type SocketErrorEvent = ServerSchemas["SocketErrorEvent"];

/** 클라이언트 → 서버 이벤트 맵 (Socket.IO ListenEvents) */
export interface ClientEvents {
  READY: (payload: ReadyEventPayload) => void;
  MOVE: (payload: MoveEventPayload) => void;
  LEAVE: (payload: LeaveEventPayload) => void;
  CHAT: (payload: unknown) => void;
  [eventName: string]: (payload: any) => void;
}

/** 서버 → 클라이언트 이벤트 맵 (Socket.IO EmitEvents) */
export interface ServerEvents {
  CONNECTED: (payload: ConnectedEvent) => void;
  ROOM_ASSIGNED: (payload: RoomAssignedEvent) => void;
  PLAYING: (payload: PlayingEvent) => void;
  EXISTING_PLAYERS: (payload: ExistingPlayersEvent) => void;
  PLAYER_JOINED: (payload: PlayerJoinedEvent) => void;
  PLAYER_READY: (payload: PlayerReadyEvent) => void;
  READY_TIMEOUT_STARTED: (payload: ReadyTimeoutStartedEvent) => void;
  READY_TIMEOUT_CANCELED: (payload: ReadyTimeoutCanceledEvent) => void;
  READY_TIMEOUT_EXPIRED: (payload: ReadyTimeoutExpiredEvent) => void;
  TURN_TIMEOUT_STARTED: (payload: TurnTimeoutStartedEvent) => void;
  MOVE_MADE: (payload: MoveMadeEvent) => void;
  NEXT_TURN: (payload: NextTurnEvent) => void;
  GAME_OVER: (payload: GameOverEvent) => void;
  PLAYER_LEFT: (payload: PlayerLeftEvent) => void;
  LEAVE_SUCCESS: (payload: LeaveSuccessEvent) => void;
  ERROR: (payload: SocketErrorEvent) => void;
  [eventName: string]: (payload: any) => void;
}
