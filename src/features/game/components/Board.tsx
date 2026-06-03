import { useGameStore } from "@/stores/useGameStore";
import { calcBoard } from "@/shared/utils/ticTacToeUtils";
import Square from "@/shared/components/Square";

export default function Board({
  selectSquare,
}: {
  selectSquare: ((row: number, col: number) => void) | false;
}) {
  const moveHistory = useGameStore((state) => state.moveHistory);
  const list = calcBoard(moveHistory);
  return (
    <ol className="flex flex-col gap-2 p-4">
      {list.map((innerArray: (string | null)[], rowIndex: number) => (
        <li key={rowIndex}>
          <ol className="flex flex-row gap-2">
            {innerArray.map((cell: string | null, colIndex: number) => (
              <li key={colIndex}>
                <Square
                  value={cell}
                  disabled={list[rowIndex][colIndex] != null || !selectSquare}
                  onClick={() =>
                    selectSquare && selectSquare(rowIndex, colIndex)
                  }
                />
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
