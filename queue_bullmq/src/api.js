const express = require("express");
const { emailQueue } = require("./queue");
const app = express();

app.use(express.json());

app.post("/email", async (req, res) => {
  const job = emailQueue.add(
    "sendEmail",
    {
      to: req.body.to,
      name: req.body.name || "User",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  );
  res.json({ queued: true, jobId: job.id });
});

app.listen(3000, () => {
  console.log("Email Queue API is running on port 3000");
});
