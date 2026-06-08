const express = require("express");
const Redis = require("ioredis");
const app = express();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.use(express.json());

function otpKey(phone) {
  return `otp:${phone}`;
}

// get OTP
app.post("/otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(otpKey(phone), otp, "EX", 30);

    return res.status(201).json({ message: "OTP generated successfully", otp });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// verify OTP
app.post("/otp/verify", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res
        .status(400)
        .json({ error: "Phone number and OTP are required" });
    }
    // check if the OTP exists for the given phone number
    const storedOtp = await redis.exists(otpKey(phone));
    // if not exists, return an error
    if (!Boolean(storedOtp)) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    // if exists, compare the provided OTP with the stored OTP
    const storedOtpValue = await redis.get(otpKey(phone));
    if (otp !== storedOtpValue) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    await redis.del(otpKey(phone));
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//know ttl of OTP
app.get("/otp/:phone/ttl", async (req, res) => {
  try {
    const ttl = await redis.ttl(otpKey(req.params.phone));
    return res.status(200).json({ ttl });
  } catch (error) {
    console.error("Error fetching OTP TTL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("OTP verification service running on port 3000");
});
