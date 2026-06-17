const { Worker } = require("bullmq");
const { connection } = require("./queue");

const emailWorker = new Worker(
  "email",
  async (job) => {
    (console.log("Processing email job:", job),
      await new Promise((resolve) => setTimeout(resolve, 1000)),
      console.log("Email job completed:", job));
  },
  { connection },
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} has been completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} has failed with error: ${err.message}`);
});
