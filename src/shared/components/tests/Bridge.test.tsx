import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Bridge from "../Bridge";
import { ImageManager } from "@/shared/services/ImageManger";

describe("Bridge", () => {
  it("기본 이미지가 렌더링", () => {
    render(<Bridge />);

    const image = screen.getByRole("img", { name: "게임 시작 준비중" });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", ImageManager.ticTacToe);
  });

  it("imageSrc prop 렌더링", () => {
    render(<Bridge imageSrc="/testImage.webp" />);

    const image = screen.getByRole("img", { name: "게임 시작 준비중" });
    expect(image).toHaveAttribute("src", "/testImage.webp");
  });
});
