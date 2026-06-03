import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { ROUTES } from "@/shared/constants/routes";
import { ModeCard } from "@/shared/components/InteractiveCard";
import { ImageManager } from "@/shared/services/ImageManger";

const SingleMode = () => {
  const navigate = useNavigate();
  const { sfxMuted } = useAudioStore();

  const playBeep = () => {
    if (!sfxMuted) {
      audioManager.play("beep");
    }
  };

  const handleSingleMode = () => {
    toast("🤔 알고리즘 구상 중...");
    setTimeout(() => {
      navigate(ROUTES.game.single);
    }, 1500);
  };

  return (
    <ModeCard
      onMouseDown={playBeep}
      onClick={handleSingleMode}
      imageSrc={ImageManager.single}
      imageAlt="싱글플레이"
      subtitle="싱글플레이"
      subtitleClassName="text-[#00995e]"
      label="AI 대전"
      backgroundClassName="bg-[#fb7da8]"
    />
  );
};

export default SingleMode;
