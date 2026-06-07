const express = require("express");
const mongoose = require("mongoose");
const Redis = require("ioredis");
const bannerRoutes = require("./route/banner");
const app = express();

// middleware
app.use(express.json());
app.use("/api", bannerRoutes);

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
    console.log({
      message: `MongoDB is connected to database: ${mongoose.connection.name}`,
    });
    console.log(mongoose.connection.name);
  } catch (error) {
    console.log({ error: `Error connecting to MongoDB: ${error.message}` });
  }
});
