// moved from ../GameBoard.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Board from "../Board";
import { useGameStore } from "@/stores/useGameStore";
import type { PlayerSymbol } from "@ttt/core";

const emptyBoard = Array(9).fill("") as PlayerSymbol[];
const filledBoard = ["X", "O", "", "", "X", "", "", "", "O"] as PlayerSymbol[];

describe("Board", () => {
  it("보드에 9개 버튼 렌더링", () => {
    useGameStore.setState((s) => ({
      tree: { ...s.tree, game: { ...s.tree.game, board: emptyBoard } },
    }));
    render(
      <Board selectSquare={vi.fn() as (index: number) => void} />,
    );
    expect(screen.getAllByRole("button")).toHaveLength(9);
  });

  it("채워진 셀의 값이 화면에 표시", () => {
    useGameStore.setState((s) => ({
      tree: { ...s.tree, game: { ...s.tree.game, board: filledBoard } },
    }));
    render(
      <Board selectSquare={vi.fn() as (index: number) => void} />,
    );
    expect(screen.getAllByText("X")).toHaveLength(2);
    expect(screen.getAllByText("O")).toHaveLength(2);
  });

  it("채워진 셀 버튼은 비활성화", () => {
    useGameStore.setState((s) => ({
      tree: { ...s.tree, game: { ...s.tree.game, board: filledBoard } },
    }));
    render(
      <Board selectSquare={vi.fn() as (index: number) => void} />,
    );
    const buttons = screen.getAllByRole("button");
    const disabledButtons = buttons.filter((btn) =>
      btn.hasAttribute("disabled"),
    );
    expect(disabledButtons).toHaveLength(3);
  });

  it("빈 셀 클릭 시 selectSquare가 올바른 인덱스와 함께 호출된다", async () => {
    useGameStore.setState((s) => ({
      tree: { ...s.tree, game: { ...s.tree.game, board: emptyBoard } },
    }));
    const selectSquare = vi.fn() as unknown as (
      index: number,
    ) => void;
    render(<Board selectSquare={selectSquare} />);
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[4]);
    expect(selectSquare).toHaveBeenCalledWith(4);
  });
});
