import State from "./State.js";
import type Ttt from "../game/Ttt.js";
import type Action from "../dtos/Action.dto.js";
declare class GameOverState extends State {
    onEnter(game: Ttt): void;
    handleAction(game: Ttt, action: Action): {
        success: boolean;
        message: string;
    };
}
export default GameOverState;
//# sourceMappingURL=GameOverState.d.ts.map