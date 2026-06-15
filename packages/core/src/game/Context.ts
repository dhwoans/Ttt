import type State from "../state/State.js";
import type { GameStateTree, Action, Response } from "../types/index.js";

export default abstract class Context {
  abstract tree: GameStateTree;
  abstract currentState: State;

  /**
   * Transition to new state and invoke its entry logic
   */
  abstract changeState(newState: State): void;

  /**
   * Delegate action processing to current state
   */
  abstract processAction(action: Action): Response<string | void>;

  /**
   * Get current game state snapshot
   */
  abstract getState(): GameStateTree;
}
