import { useNavigate } from "react-router-dom";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { toast } from "react-toastify";
import Badge from "@/shared/components/Badge";
import { InteractiveCard } from "@/shared/components/InteractiveCard";
import { ImageManager } from "@/shared/services/ImageManger";
import Subtitle from "./Subtitle";
import { LobbyContentsLayout } from "@/layouts/LobbyContentsLayout";
import { ROUTES } from "@/shared/constants/routes";

const SingleMode = () => {
  const navigate = useNavigate();
  const { sfxMuted } = useAudioStore();
  const playBeep = () => {
    if (!sfxMuted) audioManager.play("beep");
  };
  const handleSingleMode = () => {
    toast("🤔 알고리즘 구상 중...");
    setTimeout(() => {
      navigate(ROUTES.game.single);
    }, 1500);
  };
  return (
    <InteractiveCard
      onMouseDown={playBeep}
      onClick={handleSingleMode}
      backgroundClassName="bg-[#fb7da8]"
      overlayText="싱글플레이"
    >
      <LobbyContentsLayout
        image={
          <img
            src={ImageManager.single}
            className="h-full w-full object-cover"
          />
        }
        icon={
          <video
            src={ImageManager.robot}
            autoPlay
            muted
            loop
            playsInline
            className="h-16 w-16 object-contain drop-shadow"
          />
        }
        title={<Subtitle text="싱글플레이" className="text-[#00995e]" />}
        content={<Badge>AI 대전</Badge>}
      />
    </InteractiveCard>
  );
};
export default SingleMode;
