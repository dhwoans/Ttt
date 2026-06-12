import IdleState from "../gameState/IdleState.js";
import type State from "../gameState/State.js";
import type Action from "../dtos/Action.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { UserId } from "../type/socket.js";
/**
 * Tic-Tac-Toe game context class (FSM Context pattern)
 * Manages game state, board, and players. Delegates all state-specific logic to current state.
 */
class Ttt {
  board: Array<string>; // 9-element array for 3x3 board
  winner: number; // -2: draw, -1: no winner, 0/1: player index
  status: string; // IDLE, PLAYING, GAME_OVER
  players: Array<UserId>; // [player1Id, player2Id]
  currentTurn: number; // Turn counter (even=player0, odd=player1)
  currentState: State;

  constructor() {
    this.board = Array(9).fill("");
    this.winner = -1;
    this.status = "IDLE";
    this.currentTurn = 0;
    this.players = [];
    this.currentState = new IdleState();
    this.currentState.onEnter(this);
  }

  /**
   * Add player ID to the game
   */
  setPlayersId(playerId: string) {
    this.players.push(playerId);
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
  ): SuccessResponse<string | void> | FailureResponse {
    return this.currentState.handleAction(this, action);
  }

  /**
   * Get current game state snapshot
   */
  getState(): {
    board: Array<string>;
    winner: number;
    status: string;
    players: Array<string>;
    currentTurn: number;
  } {
    return {
      board: this.board,
      winner: this.winner,
      status: this.status,
      players: this.players,
      currentTurn: this.currentTurn,
    };
  }
}

export default Ttt;
