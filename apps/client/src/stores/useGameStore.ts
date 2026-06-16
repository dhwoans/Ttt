import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useRoomStore } from "./useRoomStore";
import { Ttt, IdleState, PlayingState, GameOverState } from "@ttt/core";
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
      setTree: (tree) => set((s) => ({ tree: { ...s.tree, ...tree } })),
      setServerTurnTimer: (serverTurnTimer) => set({ serverTurnTimer }),
      dispatch: (action) =>
        set((state) => {
          const game = new Ttt();
          // 깊은 복사로 불변성 보장 및 현재 상태 주입
          game.tree = JSON.parse(JSON.stringify(state.tree));

          // START 액션일 경우, RoomStore의 최신 플레이어 목록을 엔진 트리에 강제 동기화
          if (action.type === "START") {
            const playersInfos = useRoomStore.getState().playersInfos;
            game.tree.players = playersInfos.map((p) => ({
              id: p.userId || "bot-id",
            }));
          }

          console.log("[Store] PRE-Dispatch Tree:", {
            status: game.tree.game.status,
            turn: game.tree.game.currentTurn,
            playersLen: game.tree.players.length,
            historyLen: game.tree.game.history.length,
          });

          // 현재 상태 클래스 복원
          switch (game.tree.game.status) {
            case "IDLE":
              game.currentState = new IdleState();
              break;
            case "PLAYING":
              game.currentState = new PlayingState();
              break;
            case "GAME_OVER":
              game.currentState = new GameOverState();
              break;
          }

          console.log("[Store] Dispatching action:", action);
          const result = game.processAction(action);
          console.log("[Store] Engine result:", result);

          if (result.success) {
            const nextTree = game.getState();
            console.log("[Store] POST-Dispatch Tree:", {
              status: nextTree.game.status,
              turn: nextTree.game.currentTurn,
              playersLen: nextTree.players.length,
              historyLen: nextTree.game.history.length,
            });
            return {
              tree: nextTree,
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
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        tree: state.tree,
        turnStartTime: state.turnStartTime,
        serverTurnTimer: state.serverTurnTimer,
      }),
    },
  ),
);
