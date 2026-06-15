import * as React from "react"
import { Square } from "./Square.js"

interface BoardProps {
  list: (string | null)[];
  selectSquare: ((index: number) => void) | false;
}

const Board = React.forwardRef<HTMLOListElement, BoardProps>(
  ({ list, selectSquare }, ref) => {
    return (
      <ol ref={ref} className="grid grid-cols-3 gap-2 p-4">
        {list.map((cell, index) => (
          <li key={index}>
            <Square
              value={cell}
              disabled={cell != null || !selectSquare}
              onClick={() => selectSquare && selectSquare(index)}
            />
          </li>
        ))}
      </ol>
    )
  }
)
Board.displayName = "Board"

export { Board }
