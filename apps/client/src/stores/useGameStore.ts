import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useRoomStore } from "./useRoomStore";
import { Ttt } from "@ttt/core";
import type { GameStateTree, Action } from "@ttt/core";

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
  setServerTurnTimer: (timer: ServerTurnTimer | null) => void;
  dispatch: (action: Action) => void; // 핵심: 코어 엔진으로 액션 전달
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
      setServerTurnTimer: (serverTurnTimer) =>
        set({ serverTurnTimer }),
      dispatch: (action) => 
        set((state) => {
          const game = new Ttt();
          // 깊은 복사로 불변성 보장 및 현재 상태 주입
          game.tree = JSON.parse(JSON.stringify(state.tree));
          
          const result = game.processAction(action);
          if (result.success) {
            return {
              tree: game.getState(),
              turnStartTime: Date.now(),
            };
          }
          return state; // 액션 실패 시 상태 변경 없음
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
