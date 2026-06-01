import { motion } from "motion/react";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { useEnterMultiMode } from "../hooks/useEnterMultiMode";
import Badge from "@/shared/components/Badge";
import { InteractiveCard } from "@/shared/components/InteractiveCard";
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
    <InteractiveCard
      as={motion.div}
      onMouseDown={playBeep}
      onClick={handleMultiMode}
      backgroundClassName="bg-[#552cb7]"
      overlayText="멀티플레이"
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
    </InteractiveCard>
  );
};
export default MultiMode;
