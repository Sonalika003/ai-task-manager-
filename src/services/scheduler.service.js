const cron = require("node-cron");
const Task = require("../models/task.model");

const startScheduler = () => {
cron.schedule("* * * * *", async () => {
  const now = new Date();

  const tasks = await Task.find({ status: "pending" });

  tasks.forEach(async (task) => {
    if (task.deadline && task.deadline < now) {
      task.status = "overdue";
      await task.save();
    }
  });

  console.log("Scheduler checked tasks...");
});
};

module.exports = { startScheduler };