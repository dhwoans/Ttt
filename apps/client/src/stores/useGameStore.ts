import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useRoomStore } from "./useRoomStore";
import type { GameStateTree, MoveNode, PlayerSymbol, GameStatus } from "@ttt/core";

/**
 * 서버에서 동기화된 턴 타이머 정보
 */
export type ServerTurnTimer = {
  timeoutMs: number;
  startedAt: number;
};

interface GameStoreState {
  tree: GameStateTree;
  
  // UI/동기화 전용 상태
  turnStartTime: number; // 로컬 턴 시작 시각 (싱글 모드 및 UI 갱신용)
  serverTurnTimer: ServerTurnTimer | null; // 서버에서 받은 타이머 스냅샷 (멀티 모드용)
  
  // Actions
  setTree: (tree: Partial<GameStateTree>) => void;
  setGameStatus: (status: GameStatus) => void;
  setWinner: (winner: number) => void;
  addMove: (move: MoveNode) => void;
  setServerTurnTimer: (timer: ServerTurnTimer | null) => void;
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
  turnStartTime: Date.now(),
  serverTurnTimer: null as ServerTurnTimer | null,
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
      setServerTurnTimer: (serverTurnTimer) =>
        set({ serverTurnTimer }),
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
            turnStartTime: Date.now(),
          };
        }),
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
        turnStartTime: state.turnStartTime,
        serverTurnTimer: state.serverTurnTimer,
      }),
    },
  ),
);
