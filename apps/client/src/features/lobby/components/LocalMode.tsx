import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { ImageManager } from "@/shared/services/ImageManger";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LocalMode = () => {
  const { sfxMuted } = useAudioStore();

  const playBeep = () => {
    if (!sfxMuted) {
      audioManager.play("beep");
    }
  };

  return (
    <Card
      className="relative mx-auto w-full max-w-sm pt-0 cursor-pointer brutal-box"
      onMouseDown={playBeep}
    >
      <div className="absolute inset-0 z-30 h-[80%] aspect-video bg-black/35" />
      <img
        src={ImageManager.local}
        alt="로컬 모드"
        className="relative z-20 aspect-video w-full h-[80%] object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">local mode</Badge>
        </CardAction>
        <CardTitle>로컬 모드</CardTitle>
        <CardDescription>
          모바일 연동을 통한 로컬 플레이 모드입니다.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default LocalMode;
