class State {
  constructor() {
    // 이 클래스는 직접 인스턴스화 될 수 없도록 함 (추상 클래스 역할)
    if (new.target === State) {
      throw new Error("인스턴스화 불가");
    }
  }

  handleAction(game, action) {
    throw new Error("handleAction 미 구현");
  }

  onEnter(game) {}
}

export default State;
