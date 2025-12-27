import State from "./State.js";
import PlayingState from "./PlayingState.js";
class IdleState extends State {
    onEnter(game) {
        game.status = "IDLE";
    }
    handleAction(game, action) {
        // Manager가 호출하는 시작 명령만 허용
        if (action.type === "MANAGER_START") {
            game.changeState(new PlayingState());
            return { success: true, message: "Transition to Playing" };
        }
        return { success: false, message: "게임 시작 명령만 유효합니다." };
    }
}
export default IdleState;
//# sourceMappingURL=IdleState.js.map