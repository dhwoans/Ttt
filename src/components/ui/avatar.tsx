import { ReactNode } from "react";

const SIZE_STYLES = {
  small: {
    container: "h-15 w-15 text-3xl",
    marker: "text-3xl",
  },
  large: {
    container: "h-50 w-50 text-8xl",
    marker: "text-8xl",
  },
} as const;

interface AvatarProps {
  size?: "small" | "large";
  children?: ReactNode;
}

export function Avatar({ size, children }: AvatarProps) {
  const avatarSize = size === "small" ? "small" : "large";
  const { container } = SIZE_STYLES[avatarSize];

  return (
    <div
      className={`relative grid place-items-center ${container} rounded-full bg-white overflow-hidden`}
    >
      <div className="flex items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
