import type { ReactNode } from "react";

interface ModalShellProps {
  className?: string;
  dialogClassName?: string;
  children: ReactNode;
}

const DEFAULT_DIALOG_CLASSNAME =
  "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full h-full flex items-center justify-center bg-transparent p-0 border-0";

const DEFAULT_PANEL_CLASSNAME =
  "bg-white rounded-2xl p-8 w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate__animated animate__bounceIn relative z-10";

export function ModalShell({
  className,
  dialogClassName,
  children,
}: ModalShellProps) {
  return (
    <dialog
      open
      className={`${DEFAULT_DIALOG_CLASSNAME} ${dialogClassName ?? ""}`.trim()}
    >
      <div className="fixed inset-0 bg-black/50 -z-10" />
      <div className={`${DEFAULT_PANEL_CLASSNAME} ${className ?? ""}`.trim()}>
        {children}
      </div>
    </dialog>
  );
}
