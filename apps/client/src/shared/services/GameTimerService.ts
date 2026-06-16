import { Ttt } from "@ttt/core";
import { useGameStore } from "@/stores/useGameStore";

/**
 * 게임 타이머 및 타임아웃을 관리하는 서비스 (React 외부)
 */
class GameTimerService {
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private onTimeoutCallback: (() => void) | null = null;

  /**
   * 타이머 시작
   * @param durationMs 지속 시간
   * @param onTimeout 타임아웃 시 실행할 콜백
   */
  public start(durationMs: number, onTimeout: () => void) {
    this.stop();
    this.onTimeoutCallback = onTimeout;
    this.timeoutId = setTimeout(() => {
      if (this.onTimeoutCallback) {
        this.onTimeoutCallback();
      }
    }, durationMs);
  }

  /**
   * 타이머 중지
   */
  public stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.onTimeoutCallback = null;
  }

  /**
   * 싱글 플레이어 모드에서 타임아웃 처리
   */
  public handleSinglePlayerTimeout(nickname: string, symbol?: string) {
    console.log(`[Timer] Timeout triggered for ${nickname} (${symbol})`);
    const { dispatch } = useGameStore.getState();

    // 스토어의 dispatch를 사용하면 내부적으로 FSM 상태 복원 및 processAction이 안전하게 수행됩니다.
    dispatch({
      type: "TIMEOUT",
      nickname,
      symbol,
      userId: "system",
    });
  }
}

export const gameTimerService = new GameTimerService();
