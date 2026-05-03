import { create } from "zustand";
import { persist } from "zustand/middleware";

// 타입 정의
type Player = {};

type Turn = {
  currentUserId: string;
  remainTime: number;
  turnCount: number;
};

type GameState = {
  roomId: string;
  status: "IDLE" | "PLAYING" | "FINISHED";
  turn: Turn;
  players: Record<string, Player>;
  history: any[];
};

interface TicTacToeGameStoreState {
  gameState: GameState;
  setGameState: (state: Partial<GameState>) => void;
  updatePlayer: (userId: string, player: Partial<Player>) => void;
  addHistory: (entry: any) => void;
  resetGame: () => void;
  nextTurn: (newUserId: string) => void;
}

const initialState: GameState = {
  roomId: "",
  status: "IDLE",
  turn: {
    currentUserId: "",
    remainTime: 10,
    turnCount: 0,
  },
  players: {},
  history: [],
};

export const useTicTacToeGameStore = create<TicTacToeGameStoreState>()(
  persist(
    (set, get) => ({
      gameState: initialState,
      setGameState: (state) =>
        set((s) => ({
          gameState: { ...s.gameState, ...state },
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
              remainTime: 25,
            },
          },
        })),
    }),
    {
      name: "tic-tac-toe-game-storage",
    },
  ),
);
