import * as React from "react"
import { Square } from "./Square.js"

interface BoardProps {
  list: (string | null)[][];
  selectSquare: ((row: number, col: number) => void) | false;
}

const Board = React.forwardRef<HTMLOListElement, BoardProps>(
  ({ list, selectSquare }, ref) => {
    return (
      <ol ref={ref} className="flex flex-col gap-2 p-4">
        {list.map((innerArray, rowIndex) => (
          <li key={rowIndex}>
            <ol className="flex flex-row gap-2">
              {innerArray.map((cell, colIndex) => (
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
    )
  }
)
Board.displayName = "Board"

export { Board }
