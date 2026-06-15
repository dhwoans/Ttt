import { WINNING_COMBINATIONS_1D, reconstructBoard } from "@ttt/core";
import type { MoveNode, PlayerSymbol } from "@ttt/core";

export interface AIEngine {
  getBestMove: (
    history: MoveNode[],
    aiSymbol: string,
    opponentSymbol: string,
  ) => number | null;
}

/**
 * 승리/방어 확인용 로직
 */
function findDecisiveMove(board: PlayerSymbol[], targetSymbol: string): number | null {
  for (const combo of WINNING_COMBINATIONS_1D) {
    let targetCount = 0;
    let emptyPos: number | null = null;

    for (const index of combo) {
      if (board[index] === targetSymbol) targetCount++;
      else if (board[index] === "") emptyPos = index;
    }

    if (targetCount === 2 && emptyPos !== null) return emptyPos;
  }
  return null;
}

/**
 * 전략적 위치 탐색 (중앙 -> 모서리 -> 가장자리)
 */
function getStrategicMove(board: PlayerSymbol[]): number | null {
  const priorities: number[] = [4, 0, 2, 6, 8, 1, 3, 5, 7];

  for (const index of priorities) {
    if (board[index] === "") {
      return index;
    }
  }
  return null;
}

// AI 엔진 구현체
export const ticTacToeAI: AIEngine = {
  getBestMove: (history, aiSymbol, opponentSymbol) => {
    const board = reconstructBoard(history);

    // 1. 공격: 내가 이길 수 있는 수 확인
    const winMove = findDecisiveMove(board, aiSymbol);
    if (winMove !== null) return winMove;

    // 2. 방어: 상대가 이기려는 수 차단
    const blockMove = findDecisiveMove(board, opponentSymbol);
    if (blockMove !== null) return blockMove;

    // 3. 전략적 배치
    return getStrategicMove(board);
  },
};
