const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNER_KEY = "app:banner";
const getBanner = async (req, res) => {
  try {
    await redis.set(BANNER_KEY, "Redis in action!");
    res.status(200).json({ message: "Banner set successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBanner };
