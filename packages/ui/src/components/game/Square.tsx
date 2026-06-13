import * as React from "react"
import { cn } from "../../lib/utils.js"

interface SquareProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string | null;
}

const Square = React.forwardRef<HTMLButtonElement, SquareProps>(
  ({ value, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "w-24 h-24 md:w-28 md:h-28 text-black bg-white border-2 border-black rounded-lg",
          "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none",
          "hover:translate-x-0.75 hover:translate-y-0.75 transition-all",
          "text-4xl md:text-5xl font-bold disabled:bg-gray-200 disabled:cursor-not-allowed active:scale-95",
          className
        )}
        {...props}
      >
        {value}
      </button>
    )
  }
)
Square.displayName = "Square"

export { Square }
