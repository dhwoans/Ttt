import { useState } from "react";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalShell } from "@/shared/components/ModalShell";
import VolumeSlider from "@/shared/components/VolumeSlider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useModalStore } from "@/stores/useModalStore";

export default function SettingsModal() {
  const {
    bgmMuted,
    sfxMuted,
    volume,
    sfxVolume,
    setBgmMuted,
    setSfxMuted,
    setVolume,
    setSfxVolume,
  } = useAudioStore();
  const [tempBgmMuted, setTempBgmMuted] = useState(bgmMuted);
  const [tempSfxMuted, setTempSfxMuted] = useState(sfxMuted);
  const [tempVolume, setTempVolume] = useState(volume);
  const [tempSfxVolume, setTempSfxVolume] = useState([sfxVolume]);
  const openModal = useModalStore((state) => state.openModal);
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  console.log(Math.round(tempSfxVolume[0]));
  const handleSave = () => {
    setBgmMuted(tempBgmMuted);
    setSfxMuted(tempSfxMuted);
    setVolume(tempVolume);
    setSfxVolume([50]);
    // AudioManager의 volume도 업데이트
    audioManager.setVolume("bgm", tempVolume);
    audioManager.setVolume("beep", Math.round(tempSfxVolume[0]));
    audioManager.setVolume("tick", Math.round(tempSfxVolume[0]));

    if (tempBgmMuted) {
      audioManager.setOff("bgm");
    } else {
      audioManager.setOn("bgm");
    }
    setOpenModal(null);
  };

  const handleCancel = () => {
    setTempBgmMuted(bgmMuted);
    setTempSfxMuted(sfxMuted);
    setTempVolume(volume);
    setTempSfxVolume(sfxVolume[0]);
    setOpenModal(null);
  };

  const getVolumeIcon = (volumePercent: number) => {
    if (volumePercent === 0) return <VolumeX size={24} />;
    if (volumePercent <= 33) return <Volume size={24} />;
    if (volumePercent <= 66) return <Volume1 size={24} />;
    return <Volume2 size={24} />;
  };

  if (openModal !== "setting") return;

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
        </DialogHeader>

        {/* BGM 볼륨 조절 섹션 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-bold text-dark-2 flex items-center gap-2">
              {getVolumeIcon(Math.round(tempVolume * 100))}
              BGM 볼륨
              <input
                type="checkbox"
                checked={tempBgmMuted}
                onChange={(e) => setTempBgmMuted(e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-accent"
              />
              <span className="text-sm font-normal text-dark-2/70">음소거</span>
            </label>
            <span className="text-2xl font-bold text-accent">
              {Math.round(tempVolume * 100)}%
            </span>
          </div>

          {/* 슬라이더 */}
          <VolumeSlider value={tempVolume} onChange={setTempVolume} />
        </div>

        {/* 효과음 볼륨 조절 섹션 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-bold text-dark-2 flex items-center gap-2">
              {getVolumeIcon(Math.round(tempSfxVolume[0] * 100))}
              효과음 볼륨
              <input
                type="checkbox"
                checked={tempSfxMuted}
                onChange={(e) => setTempSfxMuted(e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-accent"
              />
              <span className="text-sm font-normal text-dark-2/70">음소거</span>
            </label>
            <span className="text-2xl font-bold text-dark-2/70">
              {Math.round(tempSfxVolume[0])}%
            </span>
          </div>

          {/* 슬라이더 */}
          <Slider
            value={tempSfxVolume}
            onValueChange={setTempSfxVolume}
            max={100}
            step={1}
          />
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-4 justify-end">
          <Button
            onClick={handleCancel}
            variant="secondary"
            className="px-6 py-3"
          >
            취소
          </Button>
          <Button onClick={handleSave} className="px-6 py-3 text-white">
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
