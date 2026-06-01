import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-black",
  secondary: "bg-white text-black",
  danger: "bg-red-500 text-white",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-5 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = [
    "brutal-btn font-bold transition-transform",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}
