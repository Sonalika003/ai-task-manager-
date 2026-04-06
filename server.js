require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const taskRoutes = require("./src/routes/task.routes");
const { startScheduler } = require("./src/services/scheduler.service");

const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();
app.use("/tasks", taskRoutes);

// Deployment Logic
if (process.env.NODE_ENV === "production" || true) {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith("/tasks")) {
      res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    }
  });
}

startScheduler();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});