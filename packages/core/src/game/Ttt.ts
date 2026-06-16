import Context from "./Context.js";
import IdleState from "../state/IdleState.js";
import type State from "../state/State.js";
import type {
  UserId,
  GameStateTree,
  Action,
  Response,
} from "../types/index.js";

/**
 * Tic-Tac-Toe game context class (FSM Context pattern)
 */
export default class Ttt extends Context {
  tree: GameStateTree;
  currentState: State;

  constructor() {
    super();
    this.tree = {
      game: {
        winner: -1,
        status: "IDLE",
        currentTurn: 0,
        history: [],
      },
      players: [],
    };
    this.currentState = new IdleState();
    this.currentState.onEnter(this);
  }

  changeState(newState: State): void {
    console.log(
      `[FSM] Transition: ${this.currentState.constructor.name} -> ${newState.constructor.name}`,
    );
    this.currentState = newState;
    newState.onEnter(this);
  }

  // 이 메서드를 통해서만 handleAction 접근
  processAction(action: Action): Response<string | void> {
    return this.currentState.handleAction(this, action);
  }

  getState(): GameStateTree {
    return this.tree;
  }

  // player 관리 메서드
  addPlayer(id: UserId, nickname: string, avatar?: string): void {
    if (this.tree.players.find((p) => p.id === id)) return;
    this.tree.players.push({ id, nickname, avatar, isReady: false });
  }

  removePlayer(id: UserId): void {
    this.tree.players = this.tree.players.filter((p) => p.id !== id);
  }

  // player 식별번호 저장 (기존 코드 호환성 및 대량 설정용)
  setPlayers(playerIds: UserId[]): void {
    this.tree.players = playerIds.map((id) => ({
      id,
      nickname: `Player ${id.substring(0, 4)}`,
      isReady: false,
    }));
  }
}
