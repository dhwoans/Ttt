export type CountdownFormat = "seconds" | "mmss";

// 카운트 다운
export interface CountdownHandle {
  start: () => void;
  stop: () => void;
  reset: (ms?: number) => void;
  getRemaining: () => number;
}

class CountdownManager implements CountdownHandle {
  startTime: number = 10000; // 기본 10초로 설정
  private startedAt: number | null = null;
  private isRunning: boolean = false;
  private rafId: number | null = null;

  /**
   * @param remainingMs 남은 시간(ms)에서 시작하고 싶을 때 사용 (예: 새로고침 후 8초 남음)
   */
  start(remainingMs?: number): void {
    if (this.isRunning) return;
    this.isRunning = true;
    // remainingMs가 있으면 그만큼 남은 상태에서 시작
    if (typeof remainingMs === "number") {
      this.startedAt = performance.now() - (this.startTime - remainingMs);
    } else {
      this.startedAt = performance.now();
    }

    const tick = () => {
      if (!this.isRunning) return;

      const elapsed = performance.now() - this.startedAt!;
      if (elapsed >= this.startTime) {
        this.stop();
      } else {
        this.rafId = requestAnimationFrame(tick);
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  reset(ms?: number): void {
    this.stop();
    this.startTime = ms ?? this.startTime;
    this.startedAt = null;
  }

  getRemaining(): number {
    if (!this.isRunning) return this.startTime;
    const elapsed = performance.now() - this.startedAt!;
    return Math.max(0, this.startTime - elapsed);
  }
}

export const countdownManager = new CountdownManager();
