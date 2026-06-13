declare class RedisManager {
    private client;
    constructor();
    private setupEventListeners;
    /**
     * Set key-value with expiration time (seconds)
     */
    setex(key: string, seconds: number, value: string): Promise<string | null>;
    /**
     * Get value by key
     */
    get(key: string): Promise<string | null>;
    /**
     * Delete key
     */
    del(key: string): Promise<number>;
    /**
     * Check if key exists
     */
    exists(key: string): Promise<boolean>;
}
export default RedisManager;
//# sourceMappingURL=redis.d.ts.map