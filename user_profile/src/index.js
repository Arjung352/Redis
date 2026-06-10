const express = require("express");
const Redis = require("ioredis");
const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// to store and send json data in redis, we have to use JSON.stringify and JSON.parse
app.post("/user/:id/json", async (req, res) => {
  const userId = req.params.id;
  await redis.set(`user:${userId}:json`, JSON.stringify(req.body));
  res.json({ message: "saved as JSON" });
});
app.get("/user/:id/json", async (req, res) => {
  const userId = req.params.id;
  const data = await redis.get(`user:${userId}:json`);
  res.json({ data: JSON.parse(data) });
});

// but we can use redis hash to store and retrieve data without the need for JSON.stringify and JSON.parse
app.post("/user/:id/hash", async (req, res) => {
  const userId = req.params.id;
  await redis.hset(`user:${userId}:hash`, req.body);
  res.json({ message: "saved as hash" });
});
app.get("/user/:id/hash", async (req, res) => {
  const userId = req.params.id;
  const data = await redis.hgetall(`user:${userId}:hash`);
  res.json({ data });
});
app.listen(3000, () => {
  console.log("User Profile Service is running on port 3000");
});
