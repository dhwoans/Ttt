import type { UserId } from "../type/socket.js";
import type { UserState } from "../type/user.js";
import type RedisManager from "../utils/redis.js";

class UserModel {
  redis: RedisManager;
  constructor(redis: RedisManager) {
    this.redis = redis;
  }

  async saveUser(userState: UserState) {}

  async getUser(userId: UserId) {}

  async deleteUser(userId: UserId) {}
}
export default UserModel;
