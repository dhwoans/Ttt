import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

type InteractionState = "default" | "hover" | "active";
import { Button } from "@/components/ui/button";

interface StoryButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "children"
> {
  label: string;
  interactionState: InteractionState;
}

function StoryButton({
  label,
  interactionState,
  className,
  ...props
}: StoryButtonProps) {
  const interactionClassMap: Record<InteractionState, string> = {
    default: "",
    hover: "translate-x-[5px] translate-y-[5px] shadow-none",
    active: "translate-x-[5px] translate-y-[5px] shadow-none scale-95",
  };

  return (
    <Button
      className={`${interactionClassMap[interactionState]} ${className ?? ""}`.trim()}
      {...props}
    >
      {label}
    </Button>
  );
}

const meta = {
  title: "Core/Button",
  component: StoryButton,
  tags: ["autodocs"],
  args: {
    label: "Play",
    variant: "default",
    size: "default",
    disabled: false,
    interactionState: "default",
  },
  argTypes: {
    label: { control: "text" },
    variant: {
      control: { type: "inline-radio" },
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
    size: {
      control: { type: "inline-radio" },
      options: ["sm", "default", "lg"],
    },
    disabled: { control: "boolean" },
    interactionState: {
      control: { type: "inline-radio" },
      options: ["default", "hover", "active"],
    },
  },
} satisfies Meta<typeof StoryButton>;

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
    variant: "destructive",
    label: "Delete",
  },
};
