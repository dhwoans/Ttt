type CancelFunction = () => void;

class EffectManager {
  private manager: Map<HTMLElement, CancelFunction>;

  constructor() {
    this.manager = new Map();
  }

  /**
   * 일회성 애니메이션 효과 적용
   */
  public effectOnce($element: HTMLElement, effectName: string): void {
    this.initEffect($element);
    const effect = `animate__${effectName}`;
    $element.classList.add("animate__animated", effect);

    $element.addEventListener(
      "animationend",
      (event: AnimationEvent) => {
        event.stopPropagation();
        $element.classList.remove("animate__animated", effect);
      },
      { once: true },
    );
  }

  /**
   * 반복 애니메이션 효과 적용
   */
  public effectRepeat($element: HTMLElement, effectName: string): void {
    this.initEffect($element);
    this.manager.set($element, this.addRepeatEffect($element, effectName));
  }

  /**
   * 진행 중인 애니메이션 중지
   */
  public stopEffect($element: HTMLElement): void {
    const cancel = this.manager.get($element);
    if (cancel) {
      cancel();
      this.manager.delete($element);
    }
  }

  private addRepeatEffect(
    $element: HTMLElement,
    effectName: string,
  ): CancelFunction {
    const effectClass = `animate__${effectName}`;

    $element.classList.add(
      "animate__animated",
      effectClass,
      "animate__infinite",
    );

    return () => {
      $element.classList.remove(
        "animate__animated",
        effectClass,
        "animate__infinite",
      );
    };
  }

  private initEffect($element: HTMLElement): void {
    const allAnimateClasses = Array.from($element.classList).filter((c) =>
      c.startsWith("animate__"),
    );
    $element.classList.remove(...allAnimateClasses);
  }
}

export const effectManger = new EffectManager();
