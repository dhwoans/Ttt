import "ws";
import type SocketMessage from "../dtos/SocketMessage.dto.ts";

export type RoomId = string;
export type UserId = string;
export type ConnId = UserId;
export type Nickname = string;
export type SocketEvent = (typeof SOCKET_EVENTS)[number];
export type EmitMode = (typeof EMIT_MODES)[keyof typeof EMIT_MODES];

export type roomInfo = {
  roomId: RoomId;
  isFull: boolean;
  currentPlayers: number;
  maxPlayers: number;
};

declare module "ws" {
  interface WebSocket {
    isAlive: boolean;
    userId: number;
    id: number;
  }
}

export const SOCKET_EVENTS = [
  "JOIN",
  "LEAVE",
  "CHAT",
  "READY",
  "MOVE",
  "GAME_START",
] as const;



export type EmitContext =
  | {
      mode: "UNICAST";
      targetId: ConnId;
      roomId?: RoomId;
      payload: SocketMessage;
    }
  | {
      mode: "BROADCAST";
      roomId: RoomId;
      targetId?: ConnId;
      payload: SocketMessage;
    }
  | {
      mode: "EXCEPT_ME";
      roomId: RoomId;
      targetId: ConnId;
      payload: SocketMessage;
    };

// interface Packet {
//   header: {
//     type: number;
//     seq: number; // 패킷 순서
//     timestamp: number; // 보낸 시간
//     version: string; // 클라이언트 버전 (버전 불일치 팅김 방지)
//   };
//   payload: SocketMessage;
// }
