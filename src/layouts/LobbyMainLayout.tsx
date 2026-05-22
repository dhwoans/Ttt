import { useEffect, useState } from "react";
import PlayerInfo from "@/features/lobby/components/PlayerInfo";
import SingleMode from "@/features/lobby/components/SingleMode";
import LocalMode from "@/features/lobby/components/LocalMode";
import MultiMode from "@/features/lobby/components/MultiMode";
import SettingsAndLogout from "@/features/lobby/components/SettingsAndLogout";

export default function LobbyContentsLayout() {
  const mainLayout = "flex flex-row gap-6 w-full h-[75vh]";
  const mobileLayout = "flex flex-col gap-6 w-full h-[75vh]";
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  useEffect(() => {
    // 가로 세로 넓이 계산
    const updateOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    updateOrientation();
    // 창바뀔때마다
    window.addEventListener("resize", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
    };
  }, []);

  return (
    <div className={isPortrait ? mobileLayout : mainLayout}>
      <SingleMode />
      <MultiMode />
      <LocalMode />
      <div className="flex flex-col gap-6 flex-1">
        <PlayerInfo />
        <SettingsAndLogout />
      </div>
    </div>
  );
}
