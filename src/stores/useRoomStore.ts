import { create } from "zustand";
import type { GamePlayerInfo } from "@/features/game/types/TicTacToeGameTypes";

export type TimeoutSnapshot = {
  timeoutMs: number;
  startedAt: number;
};

interface RoomState {
  isWaitingForServer: boolean;
  socketId: string | null;
  gameServerUrl: string | null;
  gameTicket: string | null;
  readyTimeoutSnapshot: TimeoutSnapshot | null;
  turnTimeoutSnapshot: TimeoutSnapshot | null;
  playersInfos: GamePlayerInfo[];
  playersReadyStatus: Record<string, boolean>;
  setIsWaitingForServer: (waiting: boolean) => void;
  setPlayersInfos: (infos: GamePlayerInfo[]) => void;
  addPlayerInfo: (info: GamePlayerInfo) => void;
  removePlayerInfo: (nickname: string) => void;
  setPlayersReadyStatus: (status: Record<string, boolean>) => void;
  updatePlayerReadyStatus: (connId: string, isReady: boolean) => void;
  removePlayerReadyStatus: (connId: string) => void;
  setSocketId: (socketId: string | null) => void;
  setGameServerConnection: (params: {
    gameServerUrl: string;
    gameTicket: string;
  }) => void;
  clearGameServerConnection: () => void;
  setReadyTimeoutSnapshot: (snapshot: TimeoutSnapshot | null) => void;
  setTurnTimeoutSnapshot: (snapshot: TimeoutSnapshot | null) => void;
}

export const useRoomStore = create<RoomState>()((set) => ({
  isWaitingForServer: false,
  socketId: null,
  gameServerUrl: null,
  gameTicket: null,
  readyTimeoutSnapshot: null,
  turnTimeoutSnapshot: null,
  playersInfos: [],
  playersReadyStatus: {},
  setIsWaitingForServer: (isWaitingForServer) => set({ isWaitingForServer }),
  setPlayersInfos: (playersInfos) => set({ playersInfos }),
  addPlayerInfo: (info) =>
    set((s) => {
      if (s.playersInfos.some((p) => p.nickname === info.nickname)) return s;
      return { playersInfos: [...s.playersInfos, info] };
    }),
  removePlayerInfo: (nickname) =>
    set((s) => ({
      playersInfos: s.playersInfos.filter((p) => p.nickname !== nickname),
    })),
  setPlayersReadyStatus: (playersReadyStatus) => set({ playersReadyStatus }),
  updatePlayerReadyStatus: (connId, isReady) =>
    set((s) => ({
      playersReadyStatus: { ...s.playersReadyStatus, [connId]: isReady },
    })),
  removePlayerReadyStatus: (connId) =>
    set((s) => {
      const next = { ...s.playersReadyStatus };
      delete next[connId];
      return { playersReadyStatus: next };
    }),
  setSocketId: (socketId) => set({ socketId }),
  setGameServerConnection: ({ gameServerUrl, gameTicket }) =>
    set({ gameServerUrl, gameTicket }),
  clearGameServerConnection: () =>
    set({ gameServerUrl: null, gameTicket: null }),
  setReadyTimeoutSnapshot: (readyTimeoutSnapshot) =>
    set({ readyTimeoutSnapshot }),
  setTurnTimeoutSnapshot: (turnTimeoutSnapshot) => set({ turnTimeoutSnapshot }),
}));
