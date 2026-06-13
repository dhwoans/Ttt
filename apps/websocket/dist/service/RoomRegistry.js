import Room from "../models/Room.js";
import { EVENT_LIST } from "../utils/eventhandler.js";
import { randomUUID } from "node:crypto";
class RoomRegistry {
    rooms = new Map();
    createRoom(roomId) {
        this.rooms.set(roomId, new Room(2));
        if (!this.rooms.get(roomId)) {
            return {
                success: false,
                message: `Failed to create room: ${roomId}`,
            };
        }
        return { success: true, message: roomId };
    }
    getRoomData(roomId) {
        const room = this.rooms.get(roomId);
        if (room) {
            return { success: true, message: room };
        }
        return { success: false, message: `Room not found: ${roomId}` };
    }
    joinPlayer(roomId, userId, nickname, avatar) {
        const room = this.rooms.get(roomId);
        if (!room || room.isFull()) {
            return {
                success: false,
                message: `Cannot join room ${roomId}: room not found or full`,
            };
        }
        room.addPlayer(userId, nickname, avatar);
        return { success: true, message: roomId };
    }
    removePlayer(roomId, userId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return {
                success: false,
                message: `Failed to remove player: room ${roomId} not found`,
            };
        }
        room.removePlayer(userId);
        if (room.players.size === 0) {
            this.rooms.delete(roomId);
            return { success: true, message: EVENT_LIST.ROOM_REMOVE };
        }
        return { success: true, message: EVENT_LIST.PLAYER_MINUS };
    }
    getRoomList() {
        const roomList = [];
        for (const roomId of this.rooms.keys()) {
            const room = this.rooms.get(roomId);
            if (!room) {
                throw new Error(`Room data inconsistency: roomId=${roomId}`);
            }
            if (room.players.size === 0) {
                this.rooms.delete(roomId);
                continue;
            }
            roomList.push({
                roomId,
                isFull: room.isFull(),
                currentPlayers: room.players.size,
                maxPlayers: room.MAX_PLAYERS,
            });
        }
        return roomList;
    }
    findOrCreateRoom() {
        for (const [roomId, room] of this.rooms.entries()) {
            if (!room.isFull()) {
                console.log(`[RoomRegistry] Found available room: ${roomId}`);
                return { success: true, message: roomId };
            }
        }
        const newRoomId = randomUUID();
        const created = this.createRoom(newRoomId);
        if (!created.success) {
            return { success: false, message: "Failed to find or create room" };
        }
        console.log(`[RoomRegistry] Created new room: ${newRoomId}`);
        return { success: true, message: newRoomId };
    }
    readyPlayer(roomId, userId, status) {
        const player = this.rooms.get(roomId)?.getPlayerDate(userId);
        if (!player) {
            return {
                success: false,
                message: `Player not found: roomId=${roomId}, userId=${userId}`,
            };
        }
        player.isReady = status;
        return { success: true };
    }
}
export default RoomRegistry;
//# sourceMappingURL=RoomRegistry.js.map