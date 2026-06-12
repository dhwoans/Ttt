import IdleState from "../gameState/IdleState.js";
export default class Context {
    winner;
    status;
    currentTurn;
    players;
    currentState;
    constructor() {
        this.winner = "";
        this.status = "IDLE";
        this.currentTurn = 0;
        this.players = [];
        this.currentState = new IdleState;
    }
}
//# sourceMappingURL=Context.js.map