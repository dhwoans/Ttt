import * as React from "react";
import { cn } from "../lib/utils.js";

export interface LogoProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text1?: string;
  text2?: string;
}

export function Logo({
  className,
  text1 = "BLITZ",
  text2 = "BLOKS",
  ...props
}: LogoProps) {
  return (
    <div className="flex flex-col items-center z-10 w-full text-center">
      <h1
        className={cn(
          "blitz-type text-[clamp(4rem,15vw,8rem)] text-[var(--yellow)] mb-12",
          "[text-shadow:6px_6px_0_var(--orange)] md:[text-shadow:8px_8px_0_var(--orange)]",
          "-rotate-2",
          className,
        )}
        {...props}
      >
        {text1}
        <br />
        {text2}
      </h1>
    </div>
  );
}
