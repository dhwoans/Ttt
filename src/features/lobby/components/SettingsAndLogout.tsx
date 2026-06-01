import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import SettingsModal from "@/shared/modals/SettingsModal";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { ImageManager } from "@/shared/services/ImageManger";
import { InteractiveCard } from "@/shared/components/InteractiveCard";
import { ROUTES } from "@/shared/constants/routes";
import { useUserStore } from "@/stores/useUserStore";
import { useGameStore } from "@/stores/useGameStore";

const SettingsAndLogout = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { sfxMuted } = useAudioStore();
  const clearCurrentUser = useUserStore((state) => state.clearCurrentUser);
  const resetGame = useGameStore((state) => state.resetGame);
  const playBeep = () => {
    if (!sfxMuted) audioManager.play("beep");
  };
  const handleLogout = () => {
    clearCurrentUser();
    resetGame();
    localStorage.removeItem("gameState");
    navigate(ROUTES.login, { replace: true });
  };
  return (
    <div className="flex flex-col gap-6 shrink-0 h-44">
      <InteractiveCard
        as={motion.div}
        onMouseDown={playBeep}
        onClick={() => setIsSettingsOpen(true)}
        backgroundClassName="bg-[#00995e]"
        overlayText="설정"
        layoutClassName="flex flex-row items-center justify-center gap-3"
      >
        <img
          src={ImageManager.gear}
          alt="설정 기어"
          className="h-14 w-14 object-contain drop-shadow"
        />
        <span className="font-bold text-black transition-opacity duration-200 group-hover:opacity-0">
          설정
        </span>
      </InteractiveCard>
      <InteractiveCard
        as={motion.div}
        onMouseDown={playBeep}
        onClick={handleLogout}
        backgroundClassName="bg-[#058cd7]"
        overlayText="나가기"
        layoutClassName="flex flex-row items-center justify-center gap-3"
      >
        <video
          src={ImageManager.wavingHand}
          autoPlay
          loop
          className="h-14 w-14 object-contain drop-shadow"
        />
        <span className="font-bold text-black transition-opacity duration-200 group-hover:opacity-0">
          나가기
        </span>
      </InteractiveCard>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
export default SettingsAndLogout;
