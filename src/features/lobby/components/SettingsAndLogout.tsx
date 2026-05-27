import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import SettingsModal from "@/shared/modals/SettingsModal";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { ImageManager } from "@/shared/services/ImageManger";
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
      <motion.div
        onMouseDown={playBeep}
        onClick={() => setIsSettingsOpen(true)}
        className="flex-1 relative bg-[#00995e] rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 flex flex-row items-center justify-center gap-3 h-full group hover-diagonal-stripes"
      >
        <img
          src={ImageManager.gear}
          alt="설정 기어"
          className="h-14 w-14 object-contain drop-shadow"
        />
        <span className="font-bold text-black transition-opacity duration-200 group-hover:opacity-0">
          설정
        </span>
        <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-3xl font-extrabold text-black drop-shadow-lg">
            설정
          </span>
        </div>
      </motion.div>
      <motion.div
        onMouseDown={playBeep}
        onClick={handleLogout}
        className="flex-1 relative bg-[#058cd7] rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 flex flex-row items-center justify-center gap-3 h-full group hover-diagonal-stripes"
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
        <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-3xl font-extrabold text-black drop-shadow-lg">
            나가기
          </span>
        </div>
      </motion.div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
export default SettingsAndLogout;
