import Context from "./Context.js";
import IdleState from "../state/IdleState.js";
import type State from "../state/State.js";
import type { UserId, GameStateTree, Action, Response } from "../types/index.js";

/**
 * Tic-Tac-Toe game context class (FSM Context pattern)
 * Manages game state, board, and players. Delegates all state-specific logic to current state.
 */
export default class Ttt extends Context {
  tree: GameStateTree;
  currentState: State;

  constructor() {
    super();
    this.tree = {
      game: {
        board: Array(9).fill(""),
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

  /**
   * Transition to new state and invoke its entry logic
   */
  changeState(newState: State): void {
    console.log(
      `[FSM] Transition: ${this.currentState.constructor.name} -> ${newState.constructor.name}`
    );
    this.currentState = newState;
    newState.onEnter(this);
  }

  /**
   * Delegate action processing to current state
   */
  processAction(
    action: Action
  ): Response<string | void> {
    return this.currentState.handleAction(this, action);
  }

  /**
   * Get current game state snapshot
   */
  getState(): GameStateTree {
    return this.tree;
  }

  /**
   * Set players for the game
   */
  setPlayers(playerIds: UserId[]): void {
    this.tree.players = playerIds.map(id => ({ id }));
  }
}
