import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
//shadcn 관련
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
