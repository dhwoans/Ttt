// moved from ../GameBoard.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Board from "../Board";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

const emptyMoveHistory: never[] = [];

// filledBoard: X at (0,0), O at (0,1), X at (1,1), O at (2,2)
const filledMoveHistory = [
  { square: { row: 0, col: 0 }, symbol: "X", nickname: "p1" },
  { square: { row: 0, col: 1 }, symbol: "O", nickname: "p2" },
  { square: { row: 1, col: 1 }, symbol: "X", nickname: "p1" },
  { square: { row: 2, col: 2 }, symbol: "O", nickname: "p2" },
];

describe("Board", () => {
  it("보드에 9개 버튼 렌더링", () => {
    useTicTacToeGameStore.setState({ moveHistory: emptyMoveHistory });
    render(
      <Board selectSquare={vi.fn() as (row: number, col: number) => void} />,
    );
    expect(screen.getAllByRole("button")).toHaveLength(9);
  });

  it("채워진 셀의 값이 화면에 표시", () => {
    useTicTacToeGameStore.setState({ moveHistory: filledMoveHistory });
    render(
      <Board selectSquare={vi.fn() as (row: number, col: number) => void} />,
    );
    expect(screen.getAllByText("X")).toHaveLength(2);
    expect(screen.getAllByText("O")).toHaveLength(2);
  });

  it("채워진 셀 버튼은 비활성화", () => {
    useTicTacToeGameStore.setState({ moveHistory: filledMoveHistory });
    render(
      <Board selectSquare={vi.fn() as (row: number, col: number) => void} />,
    );
    const buttons = screen.getAllByRole("button");
    const disabledButtons = buttons.filter((btn) =>
      btn.hasAttribute("disabled"),
    );
    expect(disabledButtons).toHaveLength(4);
  });

  it("빈 셀 클릭 시 selectSquare가 올바른 좌표와 함께 호출된다", async () => {
    useTicTacToeGameStore.setState({ moveHistory: emptyMoveHistory });
    const selectSquare = vi.fn() as unknown as (
      row: number,
      col: number,
    ) => void;
    render(<Board selectSquare={selectSquare} />);
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[4]);
    expect(selectSquare).toHaveBeenCalledWith(1, 1);
  });
});
