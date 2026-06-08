import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { ROUTES } from "@/shared/constants/routes";
import { ModeCard } from "@/shared/components/InteractiveCard";
import { ImageManager } from "@/shared/services/ImageManger";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  // return (
  //   <ModeCard
  //     onMouseDown={playBeep}
  //     onClick={handleSingleMode}
  //     imageSrc={ImageManager.single}
  //     imageAlt="싱글플레이"
  //     subtitle="싱글플레이"
  //     subtitleClassName="text-[#00995e]"
  //     label="AI 대전"
  //     backgroundClassName="bg-[#fb7da8]"
  //   />
  // );
  return (
    <Card
      className="relative mx-auto w-full max-w-sm pt-0 cursor-pointer brutal-box"
      onClick={handleSingleMode}
    >
      <div className="absolute inset-0 z-30 h-[80%] aspect-video bg-black/35" />
      <img
        src={ImageManager.single}
        alt="싱글플레이"
        className="relative z-20 aspect-video w-full h-[80%] object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">single mode</Badge>
        </CardAction>
        <CardTitle>싱글 모드</CardTitle>
        <CardDescription>
          A practical talk on component APIs, accessibility, and shipping
          faster.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default SingleMode;
