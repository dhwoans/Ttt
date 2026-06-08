import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AudioState {
  bgmMuted: boolean;
  sfxMuted: boolean;
  volume: number;
  sfxVolume: number;
  setBgmMuted: (muted: boolean) => void;
  setSfxMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setSfxVolume: (volume: number[]) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      bgmMuted: false,
      sfxMuted: false,
      volume: 0.3,
      sfxVolume: 0.8,
      setBgmMuted: (muted: boolean) => set({ bgmMuted: muted }),
      setSfxMuted: (muted: boolean) => set({ sfxMuted: muted }),
      setVolume: (volume: number) =>
        set({ volume: Math.max(0, Math.min(1, volume)) }),
      setSfxVolume: (volume: number[]) =>
        set({ sfxVolume: Math.max(0, Math.min(1, volume[0])) }),
    }),
    {
      name: "audio-storage",
    },
  ),
);
