import { motion } from "motion/react";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { useEnterMultiMode } from "../hooks/useEnterMultiMode";
import Badge from "@/shared/components/Badge";
import { ImageManager } from "@/shared/services/ImageManger";
import Subtitle from "./Subtitle";
import { LobbyContentsLayout } from "@/layouts/LobbyContentsLayout";

const MultiMode = () => {
  const { sfxMuted } = useAudioStore();
  const { handleMultiMode } = useEnterMultiMode();
  const playBeep = () => {
    if (!sfxMuted) audioManager.play("beep");
  };
  return (
    <motion.div
      onMouseDown={playBeep}
      onClick={handleMultiMode}
      className="flex-1 relative bg-[#552cb7] rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 flex flex-col items-center justify-center gap-2 h-full group hover-diagonal-stripes"
    >
      <LobbyContentsLayout
        image={
          <img
            src={ImageManager.multi}
            className="h-full w-full object-cover"
          />
        }
        icon={
          <video
            src={ImageManager.chequeredFlag}
            autoPlay
            loop
            muted
            playsInline
            className="h-16 w-16 object-contain"
          />
        }
        title={<Subtitle text="멀티플레이" className="text-[#058cd7]" />}
        content={<Badge>온라인</Badge>}
      />

      <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-3xl font-extrabold text-black drop-shadow-lg">
          멀티플레이
        </span>
      </div>
    </motion.div>
  );
};
export default MultiMode;
