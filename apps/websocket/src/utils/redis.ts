import { Redis } from "ioredis";

class RedisManager {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      retryStrategy: (times: number) => {
        return Math.min(times * 50, 2000);
      },
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.client.on("connect", () => console.log("Redis 연결 시도 중..."));
    this.client.on("ready", () => console.log("Redis 연결 성공 및 준비 완료!"));
    this.client.on("error", (err) => console.error("Redis 연결 에러:", err));
    this.client.on("end", () => console.log("Redis 연결 종료"));
  }

  /**
   * Set key-value with expiration time (seconds)
   */
  async setex(
    key: string,
    seconds: number,
    value: string,
  ): Promise<string | null> {
    try {
      return await this.client.setex(key, seconds, value);
    } catch (error) {
      console.error("[RedisManager] setex error:", error);
      return null;
    }
  }

  /**
   * Get value by key
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error("[RedisManager] get error:", error);
      return null;
    }
  }

  /**
   * Delete key
   */
  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      console.error("[RedisManager] del error:", error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error("[RedisManager] exists error:", error);
      return false;
    }
  }
}

export default RedisManager;
