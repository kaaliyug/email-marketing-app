import { Redis } from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,

    // Required by BullMQ
    maxRetriesPerRequest: null,
});
redis.on("connect", () => {
    console.log("✅ Redis Connected");
});
redis.on("error", (err: Error) => {
    console.error("❌ Redis Error:", err.message);
});

export default redis;