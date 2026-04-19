const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",

  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("Redis reconnect failed");
        return new Error("Retry attempts exhausted");
      }
      return Math.min(retries * 100, 3000); // backoff
    },
  },
});

// EVENTS
client.on("connect", () => {
  console.log("Redis connected");
});

client.on("ready", () => {
  console.log("🔥 Redis ready");
});

client.on("error", (err) => {
  console.error("Redis error:", err.message);
});

client.on("end", () => {
  console.log("Redis disconnected");
});

// CONNECT
(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("Redis init failed:", err.message);
  }
})();

module.exports = client;
