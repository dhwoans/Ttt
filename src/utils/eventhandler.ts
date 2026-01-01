import { EventEmitter } from "events";

export const eventshandler = new EventEmitter();
export const EVENT_LIST = {
  // lobby
  ROOM_CREATE: "ROOM_CREATE",
  ROOM_REMOVE: "ROOM_REMOVE",
  PLAYER_PLUS: "PLAYER_PLUS", // 방 인원 증가
  PLAYER_MINUS: "PLAYER_MINUS", // 방 인원 감소
  // game room
  ROOM_JOIN: "JOIN",
  LEAVE: "LEAVE",
  CHAT: "CHAT",
  READY: "READY",
  MOVE: "MOVE",
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER",
  ERROR: "ERROR",
} as const;

export const EMIT_MODES = {
  UNICAST: "UNICAST",
  BROADCAST: "BROADCAST",
  EXCEPT_ME: "EXCEPT_ME",
} as const;
