import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useRoomStore } from "./useRoomStore";

export type MoveEntry = {
  square: { row: number; col: number };
  symbol: string;
  nickname: string;
};

export type Turn = {
  currentUserId: string; // single mode 에서 안씀,  playersInfos[moveHistory.length % 2] 로 currentPlayer 찾음
  remainTime: number;
  turnCount: number;
};

export type TimeoutSnapshot = {
  timeoutMs: number;
  startedAt: number;
};

export type GameState = {
  roomId: string;
  status: "IDLE" | "PLAYING" | "FINISHED";
  result: "win" | "draw" | null;
  turn: Turn;
  winner: string | null;
};

interface GameStoreState {
  gameState: GameState;
  moveHistory: MoveEntry[];
  timeoutBy: string | null;
  turnStart: number;
  turnTimeoutSnapshot: TimeoutSnapshot | null;
  setGameState: (state: Partial<GameState>) => void;
  setStatus: (status: "IDLE" | "PLAYING" | "FINISHED") => void;
  setResult: (result: "win" | "draw" | null) => void;
  setWinner: (winner: string | null) => void;
  setTimeoutBy: (nickname: string | null) => void;
  setCurrentTurnUserId: (userId: string) => void;
  addMove: (entry: MoveEntry) => void;
  nextTurn: (newUserId: string) => void;
  setRoomId: (roomId: string) => void;
  setTurnTimeoutSnapshot: (snapshot: TimeoutSnapshot | null) => void;
  resetGame: () => void;
  resetGameBoard: () => void;
}

const initialGameState: GameState = {
  roomId: "",
  status: "IDLE",
  result: null,
  turn: { currentUserId: "", remainTime: 10, turnCount: 0 },
  winner: null,
};

const initialGameStoreState = () => ({
  gameState: initialGameState,
  moveHistory: [] as MoveEntry[],
  timeoutBy: null as string | null,
  turnStart: Date.now(),
  turnTimeoutSnapshot: null as TimeoutSnapshot | null,
});

export const useGameStore = create<GameStoreState>()(
  persist(
    (set) => ({
      ...initialGameStoreState(),
      setGameState: (state) =>
        set((s) => ({ gameState: { ...s.gameState, ...state } })),
      setStatus: (status) =>
        set((s) => ({ gameState: { ...s.gameState, status } })),
      setResult: (result) =>
        set((s) => ({ gameState: { ...s.gameState, result } })),
      setWinner: (winner) =>
        set((s) => ({ gameState: { ...s.gameState, winner } })),
      setTimeoutBy: (timeoutBy) => set({ timeoutBy }),
      setCurrentTurnUserId: (userId) =>
        set((s) => ({
          gameState: {
            ...s.gameState,
            turn: { ...s.gameState.turn, currentUserId: userId },
          },
        })),
      addMove: (entry) =>
        set((s) => ({
          moveHistory: [...s.moveHistory, entry],
          turnStart: Date.now(),
        })),
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
      setRoomId: (roomId) =>
        set((s) => ({ gameState: { ...s.gameState, roomId } })),
      setTurnTimeoutSnapshot: (turnTimeoutSnapshot) =>
        set({ turnTimeoutSnapshot }),
      resetGame: () => {
        useRoomStore.setState({
          playersInfos: [],
        });
        set(initialGameStoreState());
      },
      resetGameBoard: () => {
        set({
          gameState: initialGameState,
          moveHistory: [],
          timeoutBy: null,
          turnStart: Date.now(),
          turnTimeoutSnapshot: null,
        });
      },
    }),
    {
      name: "ttt-game-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        gameState: state.gameState,
        moveHistory: state.moveHistory,
        timeoutBy: state.timeoutBy,
        turnStart: state.turnStart,
        turnTimeoutSnapshot: state.turnTimeoutSnapshot,
      }),
    },
  ),
);
