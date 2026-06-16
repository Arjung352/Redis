// implemented a simple email queue using Redis lists. The service provides two endpoints: one for adding email jobs to the queue and another for processing one email job at a time. The email jobs are stored as JSON strings in a Redis list, and the processing endpoint simulates sending an email by logging the job details to the console.
const express = require("express");
const Redis = require("ioredis");
const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = "queue:email";

app.post("/email", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject,
    body: req.body.body,
    createdAt: new Date().toISOString(),
  };
  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  res.json({ queued: true, job });
});

app.get("/email/process-one", async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_KEY);
  if (!rawJob) {
    return res.json({ message: "No jobs in the queue" });
  }
  const job = JSON.parse(rawJob);
  // Simulate email sending
  console.log("rawJob\n", typeof rawJob, rawJob);
  res.json({ message: "email sent", job });
});
app.listen(3000, () => {
  console.log("Email Queue Service is running on port 3000");
});
