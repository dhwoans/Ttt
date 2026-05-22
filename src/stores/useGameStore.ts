import { create } from "zustand";
import { useUserStore } from "./useUserStore";
import { useRoomStore } from "./useRoomStore";
import { useModalStore } from "./useModalStore";

type Player = Record<string, unknown>;

export type MoveEntry = {
  square: { row: number; col: number };
  symbol: string;
  nickname: string;
};

export type Turn = {
  currentUserId: string;
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
  players: Record<string, Player>;
  history: any[];
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
  updatePlayer: (userId: string, player: Partial<Player>) => void;
  addHistory: (entry: any) => void;
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
  players: {},
  winner: null,
  history: [],
};

const initialGameStoreState = () => ({
  gameState: initialGameState,
  moveHistory: [] as MoveEntry[],
  timeoutBy: null as string | null,
  turnStart: Date.now(),
  turnTimeoutSnapshot: null as TimeoutSnapshot | null,
});

export const useGameStore = create<GameStoreState>()((set) => ({
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
      gameState: { ...s.gameState, history: [...s.gameState.history, entry] },
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
  setTurnTimeoutSnapshot: (turnTimeoutSnapshot) => set({ turnTimeoutSnapshot }),
  resetGame: () => {
    useUserStore.setState({ myPlayer: null });
    useRoomStore.setState({
      isWaitingForServer: false,
      socketId: null,
      gameServerUrl: null,
      gameTicket: null,
      readyTimeoutSnapshot: null,
      playersInfos: [],
      playersReadyStatus: {},
    });
    useModalStore.setState({ openModal: null });
    set(initialGameStoreState());
  },
  resetGameBoard: () => {
    useModalStore.setState({ openModal: null });
    useRoomStore.setState({ isWaitingForServer: false });
    set({
      gameState: initialGameState,
      moveHistory: [],
      timeoutBy: null,
      turnStart: Date.now(),
      turnTimeoutSnapshot: null,
    });
  },
}));
