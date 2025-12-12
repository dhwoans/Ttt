class State {
  constructor() {
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
