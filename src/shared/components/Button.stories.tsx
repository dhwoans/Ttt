import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type InteractionState = "default" | "hover" | "active";

interface StoryButtonProps {
  label: string;
  variant: ButtonVariant;
  disabled: boolean;
  interactionState: InteractionState;
}

function StoryButton({
  label,
  variant,
  disabled,
  interactionState,
}: StoryButtonProps) {
  const variantClassMap: Record<ButtonVariant, string> = {
    primary: "bg-yellow-400 text-black",
    secondary: "bg-white text-black",
    danger: "bg-red-500 text-white",
  };

  const interactionClassMap: Record<InteractionState, string> = {
    default: "",
    hover: "translate-x-[5px] translate-y-[5px] shadow-none",
    active: "translate-x-[5px] translate-y-[5px] shadow-none scale-95",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`brutal-btn rounded-xl px-5 py-3 text-sm font-bold transition-transform ${variantClassMap[variant]} ${interactionClassMap[interactionState]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {label}
    </button>
  );
}

const meta = {
  title: "Core/Button",
  component: StoryButton,
  tags: ["autodocs"],
  args: {
    label: "Play",
    variant: "primary",
    disabled: false,
    interactionState: "default",
  },
  argTypes: {
    label: { control: "text" },
    variant: {
      control: { type: "inline-radio" },
      options: ["primary", "secondary", "danger"],
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
    variant: "danger",
    label: "Delete",
  },
};
