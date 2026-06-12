import { describe, expect, it } from "vitest";
import Subtitle from "../Subtitle";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Subtitle test", () => {
  it("text 적용", () => {
    render(<Subtitle text="🐸" />);
    const subtitle = screen.getByText("🐸");
    expect(subtitle).toBeInTheDocument();
  });

  it("커스텀 className 적용", () => {
    render(<Subtitle text="커스텀" className="text-red-500" />);
    const subtitle = screen.getByText("커스텀");
    expect(subtitle).toHaveClass("text-red-500");
    // 기본 클래스 확인
    expect(subtitle).toHaveClass("text-2xl");
  });
});
