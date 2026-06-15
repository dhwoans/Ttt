import { useGameStore } from "@/stores/useGameStore";
import { reconstructBoard } from "@ttt/core";
import { Board as UIBoard } from "@ttt/ui";

export default function Board({
  selectSquare,
}: {
  selectSquare: ((index: number) => void) | false;
}) {
  const history = useGameStore((state) => state.tree.game.history);
  const list = reconstructBoard(history).map((cell) => (cell === "" ? null : cell));
  
  return <UIBoard list={list} selectSquare={selectSquare} />;
}
