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

interface ModeCardProps {
  imageSrc: string;
  imageAlt: string;
  subtitle: string;
  subtitleClassName?: string;
  label: string;
  backgroundClassName?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
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

export function ModeCard({
  imageSrc,
  imageAlt,
  subtitle,
  subtitleClassName,
  label,
  backgroundClassName,
  className,
  onClick,
  onMouseDown,
}: ModeCardProps) {
  return (
    <div
      onClick={onClick}
      onMouseDown={onMouseDown}
      
      className={`${BASE_CARD_CLASSNAME} ${backgroundClassName ?? ""} ${className ?? ""} flex min-h-60 flex-col overflow-hidden p-3 sm:min-h-70 sm:p-4 md:p-6`.trim()}
    >
      <div className="-mx-3 -mt-3 sm:-mx-4 sm:-mt-4 md:-mx-6 md:-mt-6 shrink-0 overflow-hidden rounded-t-xl">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-30 w-full object-cover sm:h-36 md:h-44 lg:h-52"
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-1 py-3 sm:gap-3 sm:py-4">
        <p
          className={`text-center text-lg leading-tight font-bold [text-shadow:1px_1px_0_#000,-1px_1px_0_#000,1px_-1px_0_#000,-1px_-1px_0_#000] sm:text-xl md:text-2xl ${subtitleClassName ?? "text-white"}`.trim()}
        >
          {subtitle}
        </p>
        <span className="rounded-lg bg-black px-2.5 py-1 text-xs font-bold text-white transition-opacity duration-200 sm:px-3 sm:text-sm">
          {label}
        </span>
      </div>
    </div>
  );
}
