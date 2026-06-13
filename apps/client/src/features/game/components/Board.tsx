import { useGameStore } from "@/stores/useGameStore";
import { calcBoard } from "@/shared/utils/ticTacToeUtils";
import { Board as UIBoard } from "@ttt/ui";

export default function Board({
  selectSquare,
}: {
  selectSquare: ((row: number, col: number) => void) | false;
}) {
  const moveHistory = useGameStore((state) => state.moveHistory);
  const list = calcBoard(moveHistory);
  
  return <UIBoard list={list} selectSquare={selectSquare} />;
}
