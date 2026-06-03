import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { ModeCard } from "@/shared/components/InteractiveCard";
import { ImageManager } from "@/shared/services/ImageManger";

const LocalMode = () => {
  const { sfxMuted } = useAudioStore();

  const playBeep = () => {
    if (!sfxMuted) {
      audioManager.play("beep");
    }
  };

  return (
    <ModeCard
      onMouseDown={playBeep}
      imageSrc={ImageManager.local}
      imageAlt="로컬 모드"
      subtitle="로컬 모드"
      subtitleClassName="text-[#ffc567]"
      label="모바일 연동"
      backgroundClassName="bg-[#fd5a46]"
      className="brutal-box"
    />
  );
};

export default LocalMode;
