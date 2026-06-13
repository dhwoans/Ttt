import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { useEnterMultiMode } from "../hooks/useEnterMultiMode";
import { ImageManager } from "@/shared/services/ImageManger";
import {
  Badge,
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ttt/ui";

const MultiMode = () => {
  const { sfxMuted } = useAudioStore();
  const { handleMultiMode } = useEnterMultiMode();

  const playBeep = () => {
    if (!sfxMuted) {
      audioManager.play("beep");
    }
  };

  return (
    <Card
      className="relative mx-auto w-full max-w-sm pt-0 cursor-pointer brutal-box"
      onClick={handleMultiMode}
      onMouseDown={playBeep}
    >
      <div className="absolute inset-0 z-30 h-[80%] aspect-video bg-black/35" />
      <img
        src={ImageManager.multi}
        alt="멀티플레이"
        className="relative z-20 aspect-video w-full h-[80%] object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">multiplayer</Badge>
        </CardAction>
        <CardTitle>멀티플레이</CardTitle>
        <CardDescription>
          온라인 유저들과 실시간으로 대전합니다.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default MultiMode;
