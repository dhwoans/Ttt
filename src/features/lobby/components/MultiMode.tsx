import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { useEnterMultiMode } from "../hooks/useEnterMultiMode";
import { ModeCard } from "@/shared/components/InteractiveCard";
import { ImageManager } from "@/shared/services/ImageManger";

const MultiMode = () => {
  const { sfxMuted } = useAudioStore();
  const { handleMultiMode } = useEnterMultiMode();

  const playBeep = () => {
    if (!sfxMuted) {
      audioManager.play("beep");
    }
  };

  return (
    <ModeCard
      onMouseDown={playBeep}
      onClick={handleMultiMode}
      imageSrc={ImageManager.multi}
      imageAlt="멀티플레이"
      subtitle="멀티플레이"
      subtitleClassName="text-[#058cd7]"
      label="온라인"
      backgroundClassName="bg-[#552cb7]"
    />
  );
};

export default MultiMode;
