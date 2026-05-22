import { eventManager } from "@/shared/services/EventManager";

type CancelFunction = () => void;

class EffectManager {
  private manager: Map<HTMLElement, CancelFunction>;

  constructor() {
    this.manager = new Map();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    eventManager.on(
      "effectOnece",
      (data: { $element: HTMLElement; effectName: string }) =>
        this.effectOnce(data.$element, data.effectName),
    );
    eventManager.on(
      "effectRepeat",
      (data: { $element: HTMLElement; effectName: string }) => {
        console.log("실행");
        this.effectRepeat(data.$element, data.effectName);
      },
    );
  }

  effectOnce($element: HTMLElement, effectName: string): void {
    //남아있는 다른 효과지움
    this.initEffect($element);
    const effect = `animate__${effectName}`;
    $element.classList.add("animate__animated", effect);

    //다른 효과 빨리 누르면 안지워짐
    $element.addEventListener(
      "animationend",
      (event: AnimationEvent) => {
        event.stopPropagation();
        $element.classList.remove("animate__animated", effect);
      },
      { once: true },
    );
  }

  effectRepeat($element: HTMLElement, effectName: string): void {
    //남아있는 다른 효과지움
    this.initEffect($element);
    this.manager.set($element, this.addRepeatEffect($element, effectName));
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

    //취소 함수 반환
    return () => {
      console.log(this.constructor.name, ": 취소 실행");
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
