import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { InteractiveCard } from "./InteractiveCard";

type InteractionState = "default" | "hover" | "active" | "disabled";

interface StoryInteractiveCardProps {
  overlayText: string;
  backgroundClassName: string;
  interactionState: InteractionState;
  horizontalLayout: boolean;
}

function StoryInteractiveCard({
  overlayText,
  backgroundClassName,
  interactionState,
  horizontalLayout,
}: StoryInteractiveCardProps) {
  const stateClassMap: Record<InteractionState, string> = {
    default: "",
    hover: "translate-x-1.5 translate-y-1.5 shadow-none",
    active: "translate-x-1.5 translate-y-1.5 shadow-none scale-[0.98]",
    disabled: "opacity-45 pointer-events-none cursor-not-allowed",
  };

  return (
    <div className="w-[320px] h-55">
      <InteractiveCard
        overlayText={overlayText}
        backgroundClassName={backgroundClassName}
        layoutClassName={
          horizontalLayout
            ? "flex flex-row items-center justify-center gap-3"
            : "flex flex-col items-center justify-center gap-2"
        }
        className={stateClassMap[interactionState]}
      >
        <div className="h-16 w-16 rounded-full border-4 border-black bg-white" />
        <span className="font-bold text-black">Atomic Card</span>
      </InteractiveCard>
    </div>
  );
}

const meta = {
  title: "Core/InteractiveCard",
  component: StoryInteractiveCard,
  tags: ["autodocs"],
  args: {
    overlayText: "멀티플레이",
    backgroundClassName: "bg-[#552cb7]",
    interactionState: "default",
    horizontalLayout: false,
  },
  argTypes: {
    overlayText: { control: "text" },
    backgroundClassName: { control: "text" },
    interactionState: {
      control: { type: "inline-radio" },
      options: ["default", "hover", "active", "disabled"],
    },
    horizontalLayout: { control: "boolean" },
  },
} satisfies Meta<typeof StoryInteractiveCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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
    interactionState: "disabled",
  },
};

export const Variation: Story = {
  args: {
    overlayText: "설정",
    backgroundClassName: "bg-[#00995e]",
    horizontalLayout: true,
  },
};
