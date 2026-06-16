import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import Players from "../Players";
import { useRoomStore } from "@/stores/useRoomStore";
import { useGameStore } from "@/stores/useGameStore";

describe("Players", () => {
  it("renders player nicknames and avatars", () => {
    const mockPlayers = [
      { nickname: "cat", avatar: "🐱", imageSrc: "cat.png", userId: "u1" },
      { nickname: "dog", avatar: "🐶", imageSrc: "dog.png", userId: "u2" },
    ];

    useRoomStore.setState({ playersInfos: mockPlayers });
    useGameStore.setState((s) => ({
      tree: {
        ...s.tree,
        players: [
          { id: "u1", nickname: "cat", isReady: false },
          { id: "u2", nickname: "dog", isReady: false }
        ],
        game: {
          ...s.tree.game,
          currentTurn: 0,
        },
      },
    }));

    render(<Players />);
    expect(screen.getByText("cat")).toBeInTheDocument();
    expect(screen.getByText("dog")).toBeInTheDocument();
    expect(screen.getByText("🐱")).toBeInTheDocument();
    expect(screen.getByText("🐶")).toBeInTheDocument();
  });
});
