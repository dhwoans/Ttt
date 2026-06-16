import type Context from "../game/Context.js";
import type { Action, Response } from "../types/index.js";

export default abstract class State {
  abstract handleAction(game: Context, action: Action): Response<string | void>;
  abstract onEnter(game: Context): void;
}
