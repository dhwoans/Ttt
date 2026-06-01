import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import Badge from "@/shared/components/Badge";
import { InteractiveCard } from "@/shared/components/InteractiveCard";
import { ImageManager } from "@/shared/services/ImageManger";
import Subtitle from "./Subtitle";
import { LobbyContentsLayout } from "@/layouts/LobbyContentsLayout";

const LocalMode = () => {
  const navigate = useNavigate();
  const { sfxMuted } = useAudioStore();
  const playBeep = () => {
    if (!sfxMuted) audioManager.play("beep");
  };
  const handleLocalMode = () => {
    // navigate(ROUTES.game.)
  };
  return (
    <InteractiveCard
      as={motion.div}
      onMouseDown={playBeep}
      onClick={handleLocalMode}
      backgroundClassName="bg-[#fd5a46]"
      overlayText="로컬 모드"
      className="brutal-box"
    >
      <LobbyContentsLayout
        image={
          <img
            src={ImageManager.local}
            className="h-full w-full object-cover"
          />
        }
        icon={
          <img
            src={ImageManager.joystick}
            alt="로컬 모드 아이콘"
            className="h-16 w-16 object-contain"
          />
        }
        title={<Subtitle text="로컬 모드" className="text-[#ffc567]" />}
        content={<Badge>모바일 연동</Badge>}
      />
    </InteractiveCard>
  );
};
export default LocalMode;
