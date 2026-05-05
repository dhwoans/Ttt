import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GamePlayerInfo } from "@/features/game/types/TicTacToeGameTypes";

// 타입 정의
type Player = {};

type MyPlayer = {
  userId: string;
  nickname: string;
  avatarIndex: number;
};

type TimeoutSnapshot = {
  timeoutMs: number;
  startedAt: number;
};

type MoveEntry = {
  square: { row: number; col: number };
  symbol: string;
  nickname: string;
};

type Turn = {
  currentUserId: string;
  remainTime: number;
  turnCount: number;
};

type GameState = {
  roomId: string;
  status: "IDLE" | "PLAYING" | "FINISHED";
  result: "win" | "draw" | null;
  turn: Turn;
  players: Record<string, Player>;
  history: any[];
  winner: string | null;
};

interface TicTacToeGameStoreState {
  gameState: GameState;
  moveHistory: MoveEntry[];
  timeoutBy: string | null;
  turnStart: number;
  openModal: "exit" | "gameOver" | null;
  isWaitingForServer: boolean;
  myPlayer: MyPlayer | null;
  socketId: string | null;
  gameServerUrl: string | null;
  gameTicket: string | null;
  readyTimeoutSnapshot: TimeoutSnapshot | null;
  turnTimeoutSnapshot: TimeoutSnapshot | null;
  setGameState: (state: Partial<GameState>) => void;
  setStatus: (status: "IDLE" | "PLAYING" | "FINISHED") => void;
  setResult: (result: "win" | "draw" | null) => void;
  setWinner: (winner: string | null) => void;
  setTimeoutBy: (nickname: string | null) => void;
  setCurrentTurnUserId: (userId: string) => void;
  setOpenModal: (modal: "exit" | "gameOver" | null) => void;
  setIsWaitingForServer: (waiting: boolean) => void;
  addMove: (entry: MoveEntry) => void;
  updatePlayer: (userId: string, player: Partial<Player>) => void;
  addHistory: (entry: any) => void;
  resetGame: () => void;
  resetGameBoard: () => void;
  nextTurn: (newUserId: string) => void;
  playersInfos: GamePlayerInfo[];
  setPlayersInfos: (infos: GamePlayerInfo[]) => void;
  addPlayerInfo: (info: GamePlayerInfo) => void;
  removePlayerInfo: (nickname: string) => void;
  playersReadyStatus: Record<string, boolean>;
  setPlayersReadyStatus: (status: Record<string, boolean>) => void;
  updatePlayerReadyStatus: (connId: string, isReady: boolean) => void;
  removePlayerReadyStatus: (connId: string) => void;
  setMyPlayer: (player: MyPlayer) => void;
  clearMyPlayer: () => void;
  setRoomId: (roomId: string) => void;
  setSocketId: (socketId: string | null) => void;
  setGameServerConnection: (params: {
    gameServerUrl: string;
    gameTicket: string;
  }) => void;
  clearGameServerConnection: () => void;
  setReadyTimeoutSnapshot: (snapshot: TimeoutSnapshot | null) => void;
  setTurnTimeoutSnapshot: (snapshot: TimeoutSnapshot | null) => void;
}

const createInitialStoreState = () => ({
  gameState: initialState,
  moveHistory: [] as MoveEntry[],
  timeoutBy: null as string | null,
  turnStart: Date.now(),
  openModal: null as "exit" | "gameOver" | null,
  isWaitingForServer: false,
  myPlayer: null as MyPlayer | null,
  playersInfos: [] as GamePlayerInfo[],
  playersReadyStatus: {} as Record<string, boolean>,
});

const initialState: GameState = {
  roomId: "",
  status: "IDLE",
  result: null,
  turn: {
    currentUserId: "",
    remainTime: 10,
    turnCount: 0,
  },
  players: {},
  winner: null,
  history: [],
};

export const useTicTacToeGameStore = create<TicTacToeGameStoreState>()(
  persist(
    (set) => ({
      ...createInitialStoreState(),
      socketId: null,
      gameServerUrl: null,
      gameTicket: null,
      readyTimeoutSnapshot: null,
      turnTimeoutSnapshot: null,
      setOpenModal: (openModal) => set({ openModal }),
      setIsWaitingForServer: (isWaitingForServer) =>
        set({ isWaitingForServer }),
      addMove: (entry: MoveEntry) =>
        set((s) => ({
          moveHistory: [...s.moveHistory, entry],
          turnStart: Date.now(),
        })),
      setCurrentTurnUserId: (userId) =>
        set((s) => ({
          gameState: {
            ...s.gameState,
            turn: { ...s.gameState.turn, currentUserId: userId },
          },
        })),
      setGameState: (state) =>
        set((s) => ({
          gameState: { ...s.gameState, ...state },
        })),
      setStatus: (status) =>
        set((s) => ({
          gameState: { ...s.gameState, status },
        })),
      setResult: (result) =>
        set((s) => ({
          gameState: { ...s.gameState, result },
        })),
      setWinner: (winner) =>
        set((s) => ({
          gameState: { ...s.gameState, winner },
        })),
      setTimeoutBy: (timeoutBy) =>
        set((s) => ({
          gameState: { ...s.gameState, timeoutBy },
        })),
      updatePlayer: (userId, player) =>
        set((s) => ({
          gameState: {
            ...s.gameState,
            players: {
              ...s.gameState.players,
              [userId]: { ...s.gameState.players[userId], ...player },
            },
          },
        })),
      addHistory: (entry) =>
        set((s) => ({
          gameState: {
            ...s.gameState,
            history: [...s.gameState.history, entry],
          },
        })),
      resetGame: () => set(createInitialStoreState()),
      resetGameBoard: () =>
        set((s) => ({
          gameState: initialState,
          moveHistory: [],
          timeoutBy: null,
          turnStart: Date.now(),
          openModal: null,
          isWaitingForServer: false,
          myPlayer: s.myPlayer,
          playersInfos: s.playersInfos,
        })),
      setPlayersInfos: (infos) => set({ playersInfos: infos }),
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
      setPlayersReadyStatus: (playersReadyStatus) =>
        set({ playersReadyStatus }),
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
      setMyPlayer: (myPlayer) => set({ myPlayer }),
      clearMyPlayer: () => set({ myPlayer: null }),
      setRoomId: (roomId) =>
        set((s) => ({
          gameState: {
            ...s.gameState,
            roomId,
          },
        })),
      setSocketId: (socketId) => set({ socketId }),
      setGameServerConnection: ({ gameServerUrl, gameTicket }) =>
        set({ gameServerUrl, gameTicket }),
      clearGameServerConnection: () =>
        set({
          gameServerUrl: null,
          gameTicket: null,
        }),
      setReadyTimeoutSnapshot: (readyTimeoutSnapshot) =>
        set({ readyTimeoutSnapshot }),
      setTurnTimeoutSnapshot: (turnTimeoutSnapshot) =>
        set({ turnTimeoutSnapshot }),
      nextTurn: (newUserId) =>
        set((s) => ({
          gameState: {
            ...s.gameState,
            turn: {
              ...s.gameState.turn,
              currentUserId: newUserId,
              turnCount: s.gameState.turn.turnCount + 1,
              remainTime: 10,
            },
          },
        })),
    }),
    {
      name: "tic-tac-toe-game-storage",
    },
  ),
);
