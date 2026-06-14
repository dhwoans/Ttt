import { WINNING_COMBINATIONS_2D as WINNING_COMBINATIONS } from "@ttt/core";

type CellSymbol = string | null;
type Board = CellSymbol[][];

interface Move {
  row: number;
  col: number;
}

// 틱택토 ai 알고리즘
// 좀더 복잡해지면 클래스로 관리
export interface AIEngine {
  getBestMove: (
    board: Board,
    aiSymbol: string,
    opponentSymbol: string,
  ) => Move | null;
}
// 틱택토AI 플레이어 로직
/**
 * 승리 조합 확인 로직
 */
function checkWinningMove(
  board: (string | null)[][],
  aiSymbol: string,
): { row: number; col: number } | null {
  for (const combo of WINNING_COMBINATIONS) {
    const positions = [
      { row: combo[0].row, col: combo[0].column },
      { row: combo[1].row, col: combo[1].column },
      { row: combo[2].row, col: combo[2].column },
    ];

    let aiCount = 0;
    let emptyPos = null;

    for (const pos of positions) {
      if (board[pos.row][pos.col] === aiSymbol) {
        aiCount++;
      } else if (board[pos.row][pos.col] === null) {
        emptyPos = pos;
      }
    }

    if (aiCount === 2 && emptyPos) {
      return emptyPos;
    }
  }
  return null;
}

/**
 * 승리확인용 로직
 */
function findDecisiveMove(board: Board, targetSymbol: string): Move | null {
  for (const combo of WINNING_COMBINATIONS) {
    const line = combo.map((pos) => ({ row: pos.row, col: pos.column }));

    let targetCount = 0;
    let emptyPos: Move | null = null;

    for (const { row, col } of line) {
      if (board[row][col] === targetSymbol) targetCount++;
      else if (board[row][col] === null) emptyPos = { row, col };
    }

    if (targetCount === 2 && emptyPos) return emptyPos;
  }
  return null;
}

/**
 * 전략적 위치 탐색
 */
function getStrategicMove(board: Board): Move | null {
  const priorities: Move[] = [
    { row: 1, col: 1 },
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 2 },
    { row: 2, col: 1 },
  ];

  return priorities.find((pos) => board[pos.row][pos.col] === null) || null;
}

// AI 엔진 구현체
export const ticTacToeAI: AIEngine = {
  getBestMove: (board, aiSymbol, opponentSymbol) => {
    // 1. 공격: 내가 이길 수 있는 수 확인
    const winMove = findDecisiveMove(board, aiSymbol);
    if (winMove) return winMove;

    // 2. 방어: 상대가 이기려는 수 차단
    const blockMove = findDecisiveMove(board, opponentSymbol);
    if (blockMove) return blockMove;

    // 3. 전략적 배치
    return getStrategicMove(board);
  },
};
