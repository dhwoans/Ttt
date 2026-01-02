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
    this.client.on("connect", () => console.log("Redis Connected!"));
    this.client.on("error", (err: Error) => console.error("Redis Error:", err));
  }
}

export default RedisManager;
