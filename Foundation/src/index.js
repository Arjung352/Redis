const express = require("express");
const mongoose = require("mongoose");
const Redis = require("ioredis");

const app = express();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/redis", async (req, res) => {
  try {
    const reply = await redis.ping();
    res.json({ message: `Redis PING response: ${reply}` });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error connecting to Redis: ${error.message}` });
  }
});

app.listen(3000, () => {
  try {
    const url = process.env.MONGO_URL || "mongodb://localhost:27017/mongo";
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(url);
    }
    res.json({
      message: `MongoDB is running on port ${mongoose.connection.name}`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error connecting to MongoDB: ${error.message}` });
  }
});
