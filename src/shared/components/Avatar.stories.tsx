import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Avatar } from "./Avatar";

type InteractionState = "default" | "hover" | "active";
type AvatarSize = "small" | "large";

interface StoryAvatarProps {
  size: AvatarSize;
  marker: string;
  disabled: boolean;
  interactionState: InteractionState;
}

function StoryAvatar({
  size,
  marker,
  disabled,
  interactionState,
}: StoryAvatarProps) {
  const interactionClassMap: Record<InteractionState, string> = {
    default: "",
    hover: "scale-105",
    active: "scale-95",
  };

  return (
    <div
      className={`${interactionClassMap[interactionState]} transition-transform ${disabled ? "opacity-35 grayscale" : ""}`}
    >
      <Avatar size={size}>{marker}</Avatar>
    </div>
  );
}

const meta = {
  title: "Core/Avatar",
  component: StoryAvatar,
  tags: ["autodocs"],
  args: {
    size: "small",
    marker: "🐱",
    disabled: false,
    interactionState: "default",
  },
  argTypes: {
    size: {
      control: { type: "inline-radio" },
      options: ["small", "large"],
    },
    marker: { control: "text" },
    disabled: { control: "boolean" },
    interactionState: {
      control: { type: "inline-radio" },
      options: ["default", "hover", "active"],
    },
  },
} satisfies Meta<typeof StoryAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    interactionState: "default",
  },
};

export const Hover: Story = {
  args: {
    interactionState: "hover",
  },
};

export const Active: Story = {
  args: {
    interactionState: "active",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Variation: Story = {
  args: {
    size: "large",
    marker: "🤖",
  },
};
