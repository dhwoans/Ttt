import Room from "../models/Room.js";
import type { SuccessResponse } from "../dtos/SuccessResponse.dto.js";
import type { FailureResponse } from "../dtos/FailureResponse.dto.js";
import type { Nickname, RoomId } from "../type/socket.js";
declare class RoomRegistry {
    private readonly rooms;
    createRoom(roomId: RoomId): SuccessResponse<RoomId> | FailureResponse;
    getRoomData(roomId: RoomId): SuccessResponse<Room> | FailureResponse;
    joinPlayer(roomId: RoomId, userId: string, nickname: Nickname, avatar?: string): SuccessResponse<RoomId> | FailureResponse;
    removePlayer(roomId: RoomId, userId: string): SuccessResponse<string> | FailureResponse;
    getRoomList(): Array<{
        roomId: RoomId;
        isFull: boolean;
        currentPlayers: number;
        maxPlayers: number;
    }>;
    findOrCreateRoom(): SuccessResponse<RoomId> | FailureResponse;
    readyPlayer(roomId: RoomId, userId: string, status: boolean): SuccessResponse | FailureResponse;
}
export default RoomRegistry;
//# sourceMappingURL=RoomRegistry.d.ts.map