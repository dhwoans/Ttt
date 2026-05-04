import { create } from "zustand";
import { persist } from "zustand/middleware";

// 타입 정의
type Player = {};

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
  setGameState: (state: Partial<GameState>) => void;
  setStatus: (status: "IDLE" | "PLAYING" | "FINISHED") => void;
  setResult: (result: "win" | "draw" | null) => void;
  setWinner: (winner: string | null) => void;
  setCurrentTurnUserId: (userId: string) => void;
  setOpenModal: (modal: "exit" | "gameOver" | null) => void;
  setIsWaitingForServer: (waiting: boolean) => void;
  addMove: (entry: MoveEntry) => void;
  updatePlayer: (userId: string, player: Partial<Player>) => void;
  addHistory: (entry: any) => void;
  resetGame: () => void;
  nextTurn: (newUserId: string) => void;
}

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
    (set, get) => ({
      gameState: initialState,
      moveHistory: [] as MoveEntry[],
      timeoutBy: null as string | null,
      turnStart: Date.now(),
      openModal: null,
      isWaitingForServer: false,
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
      resetGame: () => set({ gameState: initialState }),
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
