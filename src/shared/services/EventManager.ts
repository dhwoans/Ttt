type EventCallback = (data: any) => void;

class EventManager {
  private events: Record<string, EventCallback[]>;

  constructor() {
    this.events = {};
  }

  /**
   * 이벤트 리스너 등록
   * @param eventName 이벤트 이름
   * @param callback 실행할 콜백 함수
   */
  on(eventName: string, callback: EventCallback): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  /**
   * 이벤트 리스너 제거
   * @param eventName 이벤트 이름
   * @param callback 제거할 콜백 함수
   */
  off(eventName: string, callback: EventCallback): void {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (cb) => cb !== callback,
      );
    }
  }

  /**
   * 일회성 이벤트 리스너 등록 (한 번 실행 후 자동 제거)
   * @param eventName 이벤트 이름
   * @param callback 실행할 콜백 함수
   */
  once(eventName: string, callback: EventCallback): void {
    const wrapper = (data: any) => {
      callback(data);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }

  /**
   * 이벤트 발생
   * @param eventName 이벤트 이름
   * @param data 전달할 데이터
   */
  emit(eventName: string, data: any): void {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(data));
    }
  }
}

export const eventManager = new EventManager();
