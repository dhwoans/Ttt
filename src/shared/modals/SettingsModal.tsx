import { useState } from "react";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/services/AudioManager";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { ModalShell } from "@/shared/components/ModalShell";
import VolumeSlider from "@/shared/components/VolumeSlider";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
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
  const [tempSfxVolume, setTempSfxVolume] = useState(sfxVolume);

  const handleSave = () => {
    setBgmMuted(tempBgmMuted);
    setSfxMuted(tempSfxMuted);
    setVolume(tempVolume);
    setSfxVolume(tempSfxVolume);
    // AudioManager의 volume도 업데이트
    audioManager.setVolume("bgm", tempVolume);
    audioManager.setVolume("beep", tempSfxVolume);
    audioManager.setVolume("tick", tempSfxVolume);

    if (tempBgmMuted) {
      audioManager.setOff("bgm");
    } else {
      audioManager.setOn("bgm");
    }
    onClose();
  };

  const handleCancel = () => {
    setTempBgmMuted(bgmMuted);
    setTempSfxMuted(sfxMuted);
    setTempVolume(volume);
    setTempSfxVolume(sfxVolume);
    onClose();
  };

  const getVolumeIcon = (volumePercent: number) => {
    if (volumePercent === 0) return <VolumeX size={24} />;
    if (volumePercent <= 33) return <Volume size={24} />;
    if (volumePercent <= 66) return <Volume1 size={24} />;
    return <Volume2 size={24} />;
  };

  if (!isOpen) return null;

  return (
    <ModalShell className="w-96 rounded-xl" dialogClassName="m-auto">
      {/* 헤더 */}
      <h2 className="text-3xl font-bold text-dark-2 mb-8">설정</h2>

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
            {getVolumeIcon(Math.round(tempSfxVolume * 100))}
            효과음 볼륨
            <input
              type="checkbox"
              checked={tempSfxMuted}
              onChange={(e) => setTempSfxMuted(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-accent"
            />
            <span className="text-sm font-normal text-dark-2/70">음소거</span>
          </label>
          <span className="text-2xl font-bold text-accent">
            {Math.round(tempSfxVolume * 100)}%
          </span>
        </div>

        {/* 슬라이더 */}
        <VolumeSlider value={tempSfxVolume} onChange={setTempSfxVolume} />
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
    </ModalShell>
  );
}
