import type { UserId } from "../type/socket.js";
import type { UserState } from "../type/user.js";
import type RedisManager from "../utils/redis.js";
declare class UserModel {
    redis: RedisManager;
    constructor(redis: RedisManager);
    saveUser(userState: UserState): Promise<void>;
    getUser(userId: UserId): Promise<void>;
    deleteUser(userId: UserId): Promise<void>;
}
export default UserModel;
//# sourceMappingURL=UserModel.d.ts.map