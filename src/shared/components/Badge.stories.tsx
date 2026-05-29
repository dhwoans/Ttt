import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Badge from "./Badge";

type InteractionState = "default" | "hover" | "active";

interface StoryBadgeProps {
  text: string;
  color: string;
  disabled: boolean;
  interactionState: InteractionState;
}

function StoryBadge({
  text,
  color,
  disabled,
  interactionState,
}: StoryBadgeProps) {
  return (
    <div
      data-state={interactionState}
      className={`inline-flex rounded-lg ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
      <style>
        {`
          [data-state="hover"] span { opacity: 0.25; }
          [data-state="active"] span { transform: scale(0.96); }
        `}
      </style>
      <Badge color={color}>{text}</Badge>
    </div>
  );
}

const meta = {
  title: "Core/Badge",
  component: StoryBadge,
  tags: ["autodocs"],
  args: {
    text: "Waiting",
    color: "text-white",
    disabled: false,
    interactionState: "default",
  },
  argTypes: {
    text: { control: "text" },
    color: {
      control: { type: "select" },
      options: [
        "text-white",
        "text-yellow-300",
        "text-lime-300",
        "text-red-300",
      ],
    },
    disabled: { control: "boolean" },
    interactionState: {
      control: { type: "inline-radio" },
      options: ["default", "hover", "active"],
    },
  },
} satisfies Meta<typeof StoryBadge>;

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
    text: "Host",
    color: "text-yellow-300",
  },
};
