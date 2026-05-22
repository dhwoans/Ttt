import { useNavigate } from "react-router-dom";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { toast } from "react-toastify";
import Badge from "@/shared/components/Badge";
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
    <div
      onMouseDown={playBeep}
      onClick={handleSingleMode}
      className="flex-1 relative bg-[#fb7da8] rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 flex flex-col items-center justify-center gap-2 h-full group hover-diagonal-stripes"
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
      <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-3xl font-extrabold text-black drop-shadow-lg">
          싱글플레이
        </span>
      </div>
    </div>
  );
};
export default SingleMode;
