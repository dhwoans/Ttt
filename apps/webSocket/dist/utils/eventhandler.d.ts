import { EventEmitter } from "events";
export declare const eventshandler: EventEmitter<[never]>;
export declare const EVENT_LIST: {
    readonly ROOM_CREATE: "ROOM_CREATE";
    readonly ROOM_REMOVE: "ROOM_REMOVE";
    readonly PLAYER_PLUS: "PLAYER_PLUS";
    readonly PLAYER_MINUS: "PLAYER_MINUS";
    readonly ROOM_JOIN: "JOIN";
    readonly LEAVE: "LEAVE";
    readonly CHAT: "CHAT";
    readonly READY: "READY";
    readonly MOVE: "MOVE";
    readonly PLAYING: "PLAYING";
    readonly GAME_OVER: "GAME_OVER";
    readonly ERROR: "ERROR";
};
export declare const EMIT_MODES: {
    readonly UNICAST: "UNICAST";
    readonly BROADCAST: "BROADCAST";
    readonly EXCEPT_ME: "EXCEPT_ME";
};
//# sourceMappingURL=eventhandler.d.ts.map