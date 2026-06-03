import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Button } from "@/components/ui/button";
import { ModalShell } from "./ModalShell";

type InteractionState = "default" | "hover" | "active" | "disabled";

type Variant = "default" | "danger";

interface StoryModalShellProps {
  title: string;
  description: string;
  panelWidth: "max-w-md" | "max-w-lg";
  interactionState: InteractionState;
  variant: Variant;
}

function StoryModalShell({
  title,
  description,
  panelWidth,
  interactionState,
  variant,
}: StoryModalShellProps) {
  const stateClassMap: Record<InteractionState, string> = {
    default: "",
    hover: "translate-x-[5px] translate-y-[5px] shadow-none",
    active: "translate-x-[5px] translate-y-[5px] shadow-none scale-95",
    disabled: "opacity-50 pointer-events-none",
  };

  return (
    <div className="w-[min(92vw,760px)] h-105 relative">
      <ModalShell className={panelWidth}>
        <h3 className="text-2xl font-black text-center mb-4 text-black">
          {title}
        </h3>
        <p className="text-center text-black mb-6">{description}</p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="secondary"
            className={stateClassMap[interactionState]}
          >
            취소
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            className={stateClassMap[interactionState]}
          >
            확인
          </Button>
        </div>
      </ModalShell>
    </div>
  );
}

const meta = {
  title: "Core/ModalShell",
  component: StoryModalShell,
  tags: ["autodocs"],
  args: {
    title: "나가시겠습니까?",
    description: "현재 진행 상태가 저장되지 않을 수 있습니다.",
    panelWidth: "max-w-md",
    interactionState: "default",
    variant: "default",
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    panelWidth: {
      control: { type: "inline-radio" },
      options: ["max-w-md", "max-w-lg"],
    },
    interactionState: {
      control: { type: "inline-radio" },
      options: ["default", "hover", "active", "disabled"],
    },
    variant: {
      control: { type: "inline-radio" },
      options: ["default", "danger"],
    },
  },
} satisfies Meta<typeof StoryModalShell>;

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
    variant: "danger",
    panelWidth: "max-w-lg",
    title: "정말 삭제할까요?",
    description: "이 작업은 되돌릴 수 없습니다.",
  },
};
