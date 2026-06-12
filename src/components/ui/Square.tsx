import type { ButtonHTMLAttributes } from "react";

interface SquareProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  value: string | null;
}

export default function Square({
  value,
  className,
  type = "button",
  ...props
}: SquareProps) {
  const classes = [
    "w-24 h-24 md:w-28 md:h-28 text-black bg-white border-2 border-black rounded-lg",
    "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none",
    "hover:translate-x-0.75 hover:translate-y-0.75 transition-all",
    "text-4xl md:text-5xl font-bold disabled:bg-gray-200 disabled:cursor-not-allowed active:scale-95",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {value}
    </button>
  );
}
