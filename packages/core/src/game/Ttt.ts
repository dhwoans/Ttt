import Context from "./Context.js";
import IdleState from "../state/IdleState.js";
import type State from "../state/State.js";
import type { UserId, GameStateSnapshot, Action, Response } from "../types/index.js";

/**
 * Tic-Tac-Toe game context class (FSM Context pattern)
 * Manages game state, board, and players. Delegates all state-specific logic to current state.
 */
export default class Ttt extends Context {
  board: Array<string>; // 9-element array for 3x3 board
  winner: number; // -2: draw, -1: no winner, 0/1: player index
  status: string; // IDLE, PLAYING, GAME_OVER
  players: Array<UserId>; // [player1Id, player2Id]
  currentTurn: number; // Turn counter
  currentState: State;

  constructor() {
    super();
    this.board = Array(9).fill("");
    this.winner = -1;
    this.status = "IDLE";
    this.currentTurn = 0;
    this.players = [];
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
  getState(): GameStateSnapshot {
    return {
      board: this.board,
      winner: this.winner,
      status: this.status,
      players: this.players,
      currentTurn: this.currentTurn,
    };
  }

  /**
   * Set players for the game
   */
  setPlayers(playerIds: UserId[]): void {
    this.players = playerIds;
  }
}
