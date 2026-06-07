const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNER_KEY = "app:banner";

// get banner
const getBanner = async (req, res) => {
  try {
    // if the banner exists then return it otherwise return a default message
    const existingBanner = await redis.exists(BANNER_KEY);
    console.log("Existing Banner:", existingBanner);
    if (existingBanner) {
      const banner = await redis.get(BANNER_KEY);
      res.status(200).json({ message: banner });
    } else {
      res.status(404).json({ message: "Banner not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// set banner
const setBanner = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    await redis.set(BANNER_KEY, message);
    res.status(200).json({ message: "Banner set successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete banner
const deleteBanner = async (req, res) => {
  try {
    const existingBanner = await redis.exists(BANNER_KEY);
    if (existingBanner) {
      await redis.del(BANNER_KEY);
      res.status(200).json({ message: "Banner deleted successfully" });
    } else {
      res.status(404).json({ message: "Banner not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBanner, setBanner, deleteBanner };
