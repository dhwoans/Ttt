import React, { type ElementType, type ReactNode } from "react";

interface InteractiveCardProps {
  as?: ElementType;
  children: ReactNode;
  overlayText?: string;
  backgroundClassName?: string;
  layoutClassName?: string;
  className?: string;
  onClick?: React.MouseEventHandler;
  onMouseDown?: React.MouseEventHandler;
}

const BASE_CARD_CLASSNAME =
  "flex-1 relative rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 h-full group hover-diagonal-stripes";

export function InteractiveCard({
  as,
  children,
  overlayText,
  backgroundClassName,
  layoutClassName = "flex flex-col items-center justify-center gap-2",
  className,
  onClick,
  onMouseDown,
}: InteractiveCardProps) {
  const Component = as ?? "div";

  return (
    <Component
      onClick={onClick}
      onMouseDown={onMouseDown}
      className={`${BASE_CARD_CLASSNAME} ${backgroundClassName ?? ""} ${layoutClassName} ${className ?? ""}`.trim()}
    >
      {children}
      {overlayText ? (
        <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-3xl font-extrabold text-black drop-shadow-lg">
            {overlayText}
          </span>
        </div>
      ) : null}
    </Component>
  );
}
