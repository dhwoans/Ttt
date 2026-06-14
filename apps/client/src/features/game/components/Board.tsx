import { useGameStore } from "@/stores/useGameStore";
import { to2D } from "@ttt/core";
import { Board as UIBoard } from "@ttt/ui";

export default function Board({
  selectSquare,
}: {
  selectSquare: ((row: number, col: number) => void) | false;
}) {
  const board1D = useGameStore((state) => state.tree.game.board);
  const list = to2D(board1D).map((row) =>
    row.map((cell) => (cell === "" ? null : cell)),
  );
  
  return <UIBoard list={list} selectSquare={selectSquare} />;
}
