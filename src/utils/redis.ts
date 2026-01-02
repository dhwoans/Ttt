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
    this.client.on("ready", () =>
      console.log("Redis 연결 성공 및 준비 완료!")
    );
    this.client.on("error", (err) => console.error("Redis 연결 에러:", err));
    this.client.on("end", () => console.log("Redis 연결 종료"));
  }
}

export default RedisManager;
