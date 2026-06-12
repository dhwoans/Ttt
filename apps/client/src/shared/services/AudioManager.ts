import { useAudioStore } from "@/stores/audioStore";
import bgmUrl from "@assets/sound/BGM.mp3";
import beepUrl from "@assets/sound/BlopSound.mp3";
import tickUrl from "@assets/sound/TickSound.mp3";
import winUrl from "@assets/sound/win.mp3";

const BGM = bgmUrl;
const BEEP = beepUrl;
const TICK = tickUrl;
const WIN = winUrl;

interface AudioOptions {
  loop?: boolean;
  volume?: number;
  autoplay?: boolean;
}

class AudioManager {
  private audios: Map<string, HTMLAudioElement>;
  private soundAssets: Record<string, string>;
  private unsubscribe: (() => void) | null = null;

  constructor() {
    this.audios = new Map();
    this.soundAssets = {
      bgm: BGM,
      beep: BEEP,
      tick: TICK,
      win: WIN,
    };
    this.init();
  }

  private init(): void {
    const { bgmMuted, volume, sfxVolume } = useAudioStore.getState();
    this.addAudio("bgm", this.soundAssets.bgm, {
      loop: true,
      volume: volume,
      autoplay: !bgmMuted,
    });
    this.addAudio("beep", this.soundAssets.beep, { volume: sfxVolume });
    this.addAudio("tick", this.soundAssets.tick, { volume: sfxVolume });
    this.addAudio("win", this.soundAssets.win, { volume: sfxVolume });
  }

  private addAudio(id: string, src: string, options: AudioOptions = {}): void {
    // 이미 존재하는 오디오는 제거
    const existingAudio = this.audios.get(id);
    if (existingAudio) {
      existingAudio.pause();
      existingAudio.src = "";
    }

    const audio = new Audio(src);
    audio.loop = options.loop ?? false;
    audio.volume = options.volume ?? 0.1;
    audio.preload = "auto";
    this.audios.set(id, audio);

    if (options.autoplay) {
      audio.play().catch((error) => {
        console.error(`[${id}] 재생 실패:`, error);
      });
    }
    console.log(`[${id}] 음향 추가됨`);
  }

  setVolume(id: string, value: number): void {
    const audio = this.audios.get(id);
    if (audio) {
      audio.volume = value;
    }
  }
  //일시정지
  setOff(id: string): void {
    const audio = this.audios.get(id);
    if (audio) {
      audio.pause();
    }
  }
  // 재개
  setOn(id: string): void {
    const audio = this.audios.get(id);
    if (audio) {
      audio.play().catch((error) => {
        console.error(`[${id}] 재생 실패:`, error);
      });
    }
  }
  // 처음부터 시작
  play(id: string): void {
    const audio = this.audios.get(id);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.error(`[${id}] 재생 실패:`, error);
      });
    }
  }

  destroy(): void {
    // 모든 오디오 정리
    this.audios.forEach((audio) => {
      audio.pause();
      audio.src = "";
    });
    this.audios.clear();

    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export const audioManager = new AudioManager();
