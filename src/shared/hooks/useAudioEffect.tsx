import { useEffect } from "react";
import { audioManager } from "@/shared/services/AudioManager";
import { useAudioStore } from "@/stores/audioStore";

export const useAudio = () => {
  // Zustand 전역 상태와 연동
  const { bgmMuted, sfxMuted, volume } = useAudioStore();

  // 상태 변화 시 audioManager에 자동 반영
  useEffect(() => {
    // BGM 볼륨 설정
    audioManager.setVolume("bgm", bgmMuted ? 0 : volume);

    // SFX 볼륨 설정 (모든 효과음에 적용)
    const sfxVolume = sfxMuted ? 0 : volume;
    audioManager.setVolume("beep", sfxVolume);
    audioManager.setVolume("tick", sfxVolume);
    audioManager.setVolume("win", sfxVolume);
  }, [bgmMuted, sfxMuted, volume]);

  // SFX 재생 (타입 안정성)
  const playSound = (id: "beep" | "tick" | "win") => {
    audioManager.play(id);
  };

  // 편의 메서드 (기존 코드 호환성)
  const playBeep = () => playSound("beep");
  const playTick = () => playSound("tick");
  const playWin = () => playSound("win");

  // BGM 제어
  const toggleBGM = (on: boolean) => {
    on ? audioManager.setOn("bgm") : audioManager.setOff("bgm");
  };

  const playBGM = () => audioManager.play("bgm");
  const stopBGM = () => audioManager.setOff("bgm");

  return {
    // 범용 메서드
    playSound,
    toggleBGM,
    playBGM,
    stopBGM,

    // 편의 메서드 (기존 코드와 호환)
    playBeep,
    playTick,
    playWin,
  };
};
