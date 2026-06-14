import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
  userId?: string;
  isReady?: boolean;
}

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
  playersInfos: GamePlayerInfo[];
  lastServerEvent: { name: string; data: any; timestamp: number } | null;
  
  setIsWaitingForServer: (waiting: boolean) => void;
  setPlayersInfos: (infos: GamePlayerInfo[]) => void;
  addPlayerInfo: (info: GamePlayerInfo) => void;
  removePlayerInfo: (nickname: string) => void;
  updatePlayerReadyStatus: (userId: string, isReady: boolean) => void;
  setSocketId: (socketId: string | null) => void;
  setGameServerConnection: (params: {
    gameServerUrl: string;
    gameTicket: string;
  }) => void;
  clearGameServerConnection: () => void;
  setReadyTimeoutSnapshot: (snapshot: TimeoutSnapshot | null) => void;
  setLastServerEvent: (name: string, data: any) => void;
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      isWaitingForServer: false,
      socketId: null,
      gameServerUrl: null,
      gameTicket: null,
      readyTimeoutSnapshot: null,
      playersInfos: [],
      lastServerEvent: null,
      
      setIsWaitingForServer: (isWaitingForServer) =>
        set({ isWaitingForServer }),
      setPlayersInfos: (playersInfos) => set({ playersInfos }),
      addPlayerInfo: (info) =>
        set((s) => {
          if (s.playersInfos.some((p) => p.nickname === info.nickname))
            return s;
          return { playersInfos: [...s.playersInfos, info] };
        }),
      removePlayerInfo: (nickname) =>
        set((s) => ({
          playersInfos: s.playersInfos.filter((p) => p.nickname !== nickname),
        })),
      updatePlayerReadyStatus: (userId, isReady) =>
        set((s) => ({
          playersInfos: s.playersInfos.map((player) =>
            player.userId === userId ? { ...player, isReady } : player,
          ),
        })),
      setSocketId: (socketId) => set({ socketId }),
      setGameServerConnection: ({ gameServerUrl, gameTicket }) =>
        set({ gameServerUrl, gameTicket }),
      clearGameServerConnection: () =>
        set({ gameServerUrl: null, gameTicket: null }),
      setReadyTimeoutSnapshot: (readyTimeoutSnapshot) =>
        set({ readyTimeoutSnapshot }),
      setLastServerEvent: (name, data) => 
        set({ lastServerEvent: { name, data, timestamp: Date.now() } }),
    }),
    {
      name: "ttt-room-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        gameServerUrl: state.gameServerUrl,
        gameTicket: state.gameTicket,
        readyTimeoutSnapshot: state.readyTimeoutSnapshot,
        playersInfos: state.playersInfos,
      }),
    },
  ),
);
