import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

type ModalVariant = "info" | "success" | "danger";
type InteractionState = "default" | "hover" | "active";

interface StoryModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: ModalVariant;
  disabled: boolean;
  interactionState: InteractionState;
}

function StoryModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant,
  disabled,
  interactionState,
}: StoryModalProps) {
  const variantClassMap: Record<ModalVariant, string> = {
    info: "bg-white text-black",
    success: "bg-lime-300 text-black",
    danger: "bg-red-500 text-white",
  };

  const interactionClassMap: Record<InteractionState, string> = {
    default: "",
    hover: "translate-x-[5px] translate-y-[5px] shadow-none",
    active: "translate-x-[5px] translate-y-[5px] shadow-none scale-95",
  };

  if (!open) {
    return (
      <div className="rounded-xl border-4 border-black bg-white px-5 py-4 text-black shadow-[5px_5px_0_0_#000]">
        Modal is closed. Enable the `open` control to preview it.
      </div>
    );
  }

  return (
    <div className="w-[min(92vw,560px)] rounded-2xl border-4 border-black bg-[#f7f2d2] p-5 text-black shadow-[8px_8px_0_0_#000]">
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 text-sm">{description}</p>
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          disabled={disabled}
          className={`rounded-lg border-4 border-black bg-white px-4 py-2 text-sm font-bold shadow-[5px_5px_0_0_#000] ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          disabled={disabled}
          className={`rounded-lg border-4 border-black px-4 py-2 text-sm font-bold shadow-[5px_5px_0_0_#000] transition-transform ${variantClassMap[variant]} ${interactionClassMap[interactionState]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

const meta = {
  title: "Core/Modal",
  component: StoryModal,
  tags: ["autodocs"],
  args: {
    open: true,
    title: "Leave Game?",
    description: "If you leave now, the current match progress will be lost.",
    confirmLabel: "Leave",
    cancelLabel: "Stay",
    variant: "danger",
    disabled: false,
    interactionState: "default",
  },
  argTypes: {
    open: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    confirmLabel: { control: "text" },
    cancelLabel: { control: "text" },
    variant: {
      control: { type: "inline-radio" },
      options: ["info", "success", "danger"],
    },
    disabled: { control: "boolean" },
    interactionState: {
      control: { type: "inline-radio" },
      options: ["default", "hover", "active"],
    },
  },
} satisfies Meta<typeof StoryModal>;

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
    variant: "success",
    title: "Match Completed",
    description: "Great game. Save this result and return to the lobby?",
    confirmLabel: "Save & Exit",
  },
};
