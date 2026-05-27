import { useGameStore } from "@/stores/useGameStore";
import { calcBoard } from "@/shared/utils/ticTacToeUtils";

export default function Board({
  selectSquare,
}: {
  selectSquare: ((row: number, col: number) => void) | false;
}) {
  const moveHistory = useGameStore((state) => state.moveHistory);
  const list = calcBoard(moveHistory);
  return (
    <ol className="flex flex-col gap-2 p-4">
      {list.map((innerArray: [], rowIndex: number) => (
        <li key={rowIndex}>
          <ol className="flex flex-row gap-2">
            {innerArray.map((cell: string, colIndex: number) => (
              <li key={colIndex}>
                <button
                  disabled={list[rowIndex][colIndex] != null || !selectSquare}
                  onClick={() =>
                    selectSquare && selectSquare(rowIndex, colIndex)
                  }
                  className="w-24 h-24 md:w-28 md:h-28 text-black bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75 transition-all text-4xl md:text-5xl font-bold disabled:bg-gray-200 disabled:cursor-not-allowed active:scale-95"
                >
                  {cell}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
