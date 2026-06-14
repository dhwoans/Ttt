import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useRoomStore } from "./useRoomStore";
import type { GameStateTree, MoveNode, PlayerSymbol, GameStatus } from "@ttt/core";

export type TimeoutSnapshot = {
  timeoutMs: number;
  startedAt: number;
};

interface GameStoreState {
  tree: GameStateTree;
  timeoutBy: string | null;
  turnStart: number;
  turnTimeoutSnapshot: TimeoutSnapshot | null;
  
  // Actions
  setTree: (tree: Partial<GameStateTree>) => void;
  setGameStatus: (status: GameStatus) => void;
  setWinner: (winner: number) => void;
  setTimeoutBy: (nickname: string | null) => void;
  addMove: (move: MoveNode) => void;
  setTurnTimeoutSnapshot: (snapshot: TimeoutSnapshot | null) => void;
  resetGame: () => void;
  resetGameBoard: () => void;
}

const initialTree: GameStateTree = {
  game: {
    board: Array(9).fill(""),
    status: "IDLE",
    winner: -1,
    currentTurn: 0,
    history: [],
  },
  players: [],
};

const initialGameStoreState = () => ({
  tree: initialTree,
  timeoutBy: null as string | null,
  turnStart: Date.now(),
  turnTimeoutSnapshot: null as TimeoutSnapshot | null,
});

export const useGameStore = create<GameStoreState>()(
  persist(
    (set) => ({
      ...initialGameStoreState(),
      setTree: (tree) =>
        set((s) => ({ tree: { ...s.tree, ...tree } })),
      setGameStatus: (status) =>
        set((s) => ({ tree: { ...s.tree, game: { ...s.tree.game, status } } })),
      setWinner: (winner) =>
        set((s) => ({ tree: { ...s.tree, game: { ...s.tree.game, winner } } })),
      setTimeoutBy: (timeoutBy) => set({ timeoutBy }),
      addMove: (move) =>
        set((s) => {
          const newBoard = [...s.tree.game.board];
          newBoard[move.index] = move.symbol;
          return {
            tree: {
              ...s.tree,
              game: {
                ...s.tree.game,
                board: newBoard,
                history: [...s.tree.game.history, move],
                currentTurn: s.tree.game.currentTurn + 1,
              },
            },
            turnStart: Date.now(),
          };
        }),
      setTurnTimeoutSnapshot: (turnTimeoutSnapshot) =>
        set({ turnTimeoutSnapshot }),
      resetGame: () => {
        useRoomStore.setState({
          playersInfos: [],
        });
        set(initialGameStoreState());
      },
      resetGameBoard: () => {
        set(initialGameStoreState());
      },
    }),
    {
      name: "ttt-game-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tree: state.tree,
        timeoutBy: state.timeoutBy,
        turnStart: state.turnStart,
        turnTimeoutSnapshot: state.turnTimeoutSnapshot,
      }),
    },
  ),
);
