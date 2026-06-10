import { WINNING_COMBINATIONS } from "@/shared/constants/winning-combinations";

type CellSymbol = string | null;

interface Move {
  row: number;
  col: number;
}

// 틱택토 승리판정,초기화, 착수 관련 로직
export interface TurnInfo {
  square: Move;
  symbol: string;
  nickname: string;
}

export const initialBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export const calcBoard = (turn: Array<TurnInfo> | undefined | null) => {
  const newBoard = [...initialBoard.map((innerArray) => [...innerArray])];
  if (Array.isArray(turn)) {
    turn.forEach((info: TurnInfo) => {
      const { square, symbol } = info;
      const { row, col } = square;
      newBoard[row][col] = symbol;
    });
  }
  return newBoard;
};

export function whoIsWin(
  board: CellSymbol[][],
  moveHistory: TurnInfo[],
): string | null {
  for (const square of WINNING_COMBINATIONS) {
    const firstSquare = board[square[0].row][square[0].column];
    const secondSquare = board[square[1].row][square[1].column];
    const thirdSquare = board[square[2].row][square[2].column];

    if (
      firstSquare !== null &&
      firstSquare === secondSquare &&
      secondSquare === thirdSquare &&
      thirdSquare === firstSquare
    ) {
      // 승리한 symbol에 해당하는 nickname 반환
      const winnerTurn = moveHistory.find((t) => t.symbol === firstSquare);
      return winnerTurn ? winnerTurn.nickname : null;
    }
  }
  return null;
}
