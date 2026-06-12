import { ReactNode, useEffect, useState } from "react";

interface LobbyContentsLayoutProps {
  image: ReactNode;
  icon: ReactNode;
  title: ReactNode;
  content?: ReactNode;
  className?: string;
}

export function LobbyContentsLayout({
  image,
  icon,
  title,
  content,
  className = "",
}: LobbyContentsLayoutProps) {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const updateOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
    };
  }, []);

  return (
    <div className={`flex h-full w-full flex-col gap-3 ${className}`}>
      {!isPortrait && (
        <div className="-mx-6 -mt-6 flex-[4] min-h-0 overflow-hidden self-stretch rounded-t-xl">
          {image}
        </div>
      )}
      <div
        className={`${isPortrait ? "flex-1" : "flex-[1]"} flex items-center gap-2`}
      >
        {icon}
        <div className="flex flex-col">
          {title}
          {content}
        </div>
      </div>
    </div>
  );
}
