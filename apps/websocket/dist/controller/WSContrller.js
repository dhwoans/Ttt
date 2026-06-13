import { EVENT_LIST, eventshandler } from "../utils/eventhandler.js";
import { EMIT_MODES } from "../utils/eventhandler.js";
class WSController {
    roomService;
    legacyWsGameService;
    constructor(roomService, legacyWsGameService) {
        this.roomService = roomService;
        this.legacyWsGameService = legacyWsGameService;
    }
    handleMove(rawMessage, userId) {
        const result = this.legacyWsGameService.processMove(rawMessage, userId);
        if (!result.success) {
            // Service already emits an error to the client, but ensure fallback emit here
            const errorPayload = {
                type: "ERROR",
                message: [result.message ?? "Move failed"],
                sender: "system",
            };
            eventshandler.emit(EVENT_LIST.ERROR, {
                mode: EMIT_MODES.UNICAST,
                targetId: userId,
                payload: errorPayload,
            });
        }
    }
    handleJoin(rawMessage, userId) {
        const { type, message, sender } = rawMessage;
        const [roomId, joinedUserId] = message;
        const checkRoomResult = this.roomService.checkRoom(roomId);
        if (!checkRoomResult.success) {
            const errorMessage = {
                type: "ERROR",
                message: ["Invalid room access"],
                sender: "system",
            };
            eventshandler.emit(EVENT_LIST.ROOM_JOIN, {
                mode: EMIT_MODES.UNICAST,
                targetId: userId,
                payload: errorMessage,
            });
        }
        else {
            const room = checkRoomResult.message;
            if (!room)
                return;
            if (room.players.size > 0) {
                const joinMessage = {
                    type: "JOIN",
                    message: [joinedUserId, "false"],
                    sender,
                };
                eventshandler.emit(EVENT_LIST.ROOM_JOIN, {
                    mode: EMIT_MODES.EXCEPT_ME,
                    roomId,
                    targetId: userId,
                    payload: joinMessage,
                });
            }
            const result = this.roomService.joinPlayer(roomId, joinedUserId, sender);
            if (result.success) {
                eventshandler.emit(EVENT_LIST.PLAYER_PLUS, roomId);
                const players = room.getAllPlayersData();
                const messageList = players.map((player) => {
                    return {
                        type: "JOIN",
                        message: [player.userId, player.isReady.toString()],
                        sender: player.nickname,
                    };
                });
                messageList.forEach((message) => {
                    eventshandler.emit(EVENT_LIST.ROOM_JOIN, {
                        mode: EMIT_MODES.UNICAST,
                        targetId: userId,
                        payload: message,
                    });
                });
            }
        }
    }
    /**
     * Handle chat message broadcast
     */
    handleChat(rawMessage) {
        const { type, message, sender } = rawMessage;
        const [roomId, chat] = message;
        const result = this.roomService.checkRoom(roomId);
        if (!result.success) {
            throw new Error(`Failed to relay chat: room ${roomId} not found`);
        }
        else {
            const chatMessage = {
                type: "CHAT",
                message: [chat],
                sender,
            };
            eventshandler.emit(EVENT_LIST.CHAT, {
                mode: EMIT_MODES.BROADCAST,
                roomId,
                payload: chatMessage,
            });
        }
    }
    /**
     * Handle player leave room
     */
    handleLeave(rawMessage, userId) {
        const { type, message, sender } = rawMessage;
        const [roomId] = message;
        const removePlayerResult = this.roomService.removePlayer(roomId, userId);
        if (removePlayerResult.success) {
            const message = removePlayerResult.message;
            eventshandler.emit(message, roomId);
            if (message === EVENT_LIST.PLAYER_MINUS) {
                const leaveMessage = {
                    type: "LEAVE",
                    message: [userId, sender],
                    sender: "system",
                };
                eventshandler.emit(EVENT_LIST.LEAVE, {
                    mode: EMIT_MODES.BROADCAST,
                    roomId,
                    payload: leaveMessage,
                });
            }
        }
        else {
            throw new Error(`Failed to process player leave: roomId=${roomId}`);
        }
    }
    /**
     * Handle player ready status and game start check
     */
    handleReady(rawMessage, userId) {
        const { type, message, sender } = rawMessage;
        const [roomId, status] = message;
        const result = this.roomService.readyPlayer(roomId, userId, Boolean(status));
        if (result.success) {
            const readyMessage = {
                type: "READY",
                message: [userId, status],
                sender: "system",
            };
            const checkRoomResult = this.roomService.checkRoom(roomId);
            if (checkRoomResult.success) {
                eventshandler.emit(EVENT_LIST.READY, {
                    mode: EMIT_MODES.BROADCAST,
                    roomId,
                    payload: readyMessage,
                });
            }
            else {
                throw Error(checkRoomResult.message ?? "Unknown error");
            }
        }
        const startGame = this.roomService.gameStart(roomId);
        if (startGame.success) {
            const resultGameState = this.roomService.getGameState(roomId);
            if (resultGameState.success && resultGameState.message) {
                const state = resultGameState.message.getState();
                const startMessage = {
                    type: state.status,
                    message: [state.players[state.currentTurn].toString()],
                    sender: "system",
                };
                const checkRoomResult = this.roomService.checkRoom(roomId);
                if (checkRoomResult.success && checkRoomResult.message) {
                    eventshandler.emit(EVENT_LIST.PLAYING, {
                        mode: EMIT_MODES.BROADCAST,
                        roomId,
                        payload: startMessage,
                    });
                }
                else {
                    throw Error(checkRoomResult.success
                        ? "Unknown error"
                        : typeof checkRoomResult.message === "string"
                            ? checkRoomResult.message
                            : "Unknown error");
                }
            }
        }
    }
}
export default WSController;
//# sourceMappingURL=WSContrller.js.map